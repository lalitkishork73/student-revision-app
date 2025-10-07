import fs from "fs";
import path from "path";
import axios from "axios";
import pdfParse from "pdf-parse";
import { ServerlessSpec } from "@pinecone-database/pinecone";
import openai from "../config/openAIConfig.js";
import pinecone from "../config/pineconeConfig.js";
import PDF from "../models/pdfModel.js";

interface DownloadPDFResult {
  filePath: string;
  pdf: any;
}

export async function downloadPDF(
  url: string,
  docId: string,
  title: string
): Promise<DownloadPDFResult> {
  const folder = path.join("tmp", docId);
  fs.mkdirSync(folder, { recursive: true });
  const filePath = path.join(folder, "document.pdf");

  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, response.data);

  const pdf = new PDF({ title, filePath, docId });
  await pdf.save();

  return { filePath, pdf };
}

export async function createIndex(docId: string, filePath: string): Promise<void> {
  console.log("🔹 Connecting to Pinecone...");

  const indexes = await pinecone.listIndexes();

  const pineconeIndexName = process.env.PINECONE_INDEX_NAME ?? "";
  if (!pineconeIndexName) throw new Error("PINECONE_INDEX_NAME is not set");

  if (!indexes.includes(pineconeIndexName)) {
    console.log("🪶 Creating Pinecone index...");
    await pinecone.createIndex({
      name: pineconeIndexName,
      dimension: 1536,
      metric: "cosine",
      spec: new ServerlessSpec({
        cloud: "aws",
        region: process.env.PINECONE_REGION ?? "us-west-2",
      }),
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const index = pinecone.Index(pineconeIndexName);

  const pdfBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(pdfBuffer);
  const text = pdfData.text.replace(/\n+/g, " ").trim();
  const chunks = splitTextIntoChunks(text);

  const vectors: {
    id: string;
    values: number[];
    metadata: { text: string; docId: string };
  }[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks[i],
    });

    vectors.push({
      id: `${docId}-${i}`,
      values: embeddingResponse.data[0].embedding as number[],
      metadata: { text: chunks[i], docId },
    });
  }

  await index.upsert({ vectors });
  console.log(`✅ Indexed PDF: ${docId}`);
}

function splitTextIntoChunks(text: string, chunkSize = 1000): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let chunk: string[] = [];

  for (const word of words) {
    if (chunk.join(" ").length + word.length < chunkSize) {
      chunk.push(word);
    } else {
      chunks.push(chunk.join(" "));
      chunk = [word];
    }
  }

  if (chunk.length) chunks.push(chunk.join(" "));
  return chunks;
}
