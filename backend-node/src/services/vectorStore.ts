// weaviateConfig.ts

// ============================================
// weaviateService.ts
import { vectors,configure, dataType } from "weaviate-client";
import {
  getWeaviateClient,
  initWeaviateClient,
  closeWeaviateClient,
} from "../config/weaviate.config";

import { recursiveChunk as chunkText } from '../utils/chunkText';

import { getEmbedding } from "./openaiService";

interface PDFChunkProperties {
  pdfId: string;
  page: number;
  text: string;
}

export async function checkWeaviateConnection(): Promise<boolean> {
  try {
    //  initWeaviateClient()
    const client = getWeaviateClient();
    const isReady = await client.isReady();
    if (!isReady) {
      throw new Error("Weaviate is not ready");
    }
    return true;
  } catch (err: any) {
    console.error("Weaviate connection failed:", err?.message || err);
    throw new Error("Weaviate unavailable");
  }
}

export async function ensureSchema(): Promise<void> {
  try {
    const client = getWeaviateClient();
    const exists = await client.collections.exists("PDFChunk");

    if (exists) {
      return;
    }

    await client.collections.create({
      name: "PDFChunk",
      description: "PDF text chunks with page metadata",
      vectorizers: vectors.text2VecOpenAI(),
      generative: configure.generative.openAI(),  
      properties: [
        {
          name: "pdfId",
          dataType: dataType.TEXT,
        },
        {
          name: "page",
          dataType: dataType.INT,
        },
        {
          name: "text",
          dataType: dataType.TEXT,
        },
      ],
    });

    console.log("Created collection PDFChunk in Weaviate");
  } catch (err) {
    console.error("Ensure schema failed:", err);
    throw err;
  }
}

export async function storeVectors(
  pages: { page: number; text: string }[],
  chunkFn = chunkText
): Promise<string> {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error("No pages to store");
  }

  await ensureSchema();
  const pdfId = Date.now().toString();

  const client = getWeaviateClient();
  const collection = client.collections.get("PDFChunk");

  const objectsToInsert = [];

  for (const { page, text } of pages) {
    const chunks = chunkFn(text, 200,50); // split into ~200 word chunks

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      console.log(embedding)

      objectsToInsert.push({
        properties: {
          pdfId,
          page,
          text: chunk,
        },
        vectors: embedding,
      });
    }
  }

  // console.log(objectsToInsert,"this is one");

  // Batch insert for better performance
  await collection.data.insertMany(objectsToInsert);

  return pdfId;
}

export async function queryVectors(
  pdfId: string,
  questionEmbedding: number[],
  topK = 4
) {
  const client = getWeaviateClient();
  const collection = client.collections.get("PDFChunk");

  const da = await collection.query.fetchObjects();
  

  const result = await collection.query.nearVector(questionEmbedding, {
    limit: topK,
    returnMetadata: ["distance"],
    filters: collection.filter.byProperty("pdfId").equal(pdfId),
  });
  // console.log("collection:", da);

  return da.objects.map((obj) => ({
    text: obj.properties.text,
    page: obj.properties.page,
    score: obj.metadata?.distance ?? null,
  }));
}

// ============================================
// Example usage in your main app or server:

async function startApp() {
  // Initialize Weaviate client at app startup
  await initWeaviateClient();

  // Your app logic here...

  // Optionally close the client on shutdown
  process.on("SIGINT", async () => {
    await closeWeaviateClient();
    process.exit(0);
  });
}

startApp();
