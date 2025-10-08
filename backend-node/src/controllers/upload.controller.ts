import { Request, Response } from "express";
import { parseWithLlamaCloud } from "../services/llamaparseService";
import { createChatSuggestions } from "../services/openaiService";
import { storeVectors } from "../services/vectorStore";
import { recursiveChunk as chunkText } from "../utils/chunkText";
import fileUpload from "express-fileupload";
import { uploadPDFToR2 } from "../services/r2Service";
import PDF from "../models/pdf.model";
import {
  startSession,
  commitTransaction,
  abortTransaction,
} from "../config/db";
export async function handleUpload(req: Request, res: Response) {
  const session = await startSession();
  try {
    const userId = (req as any).user.id; // from authMiddleware
    if (!req?.files?.file) {
      return res
        .status(400)
        .json({ error: 'No file uploaded. Use field name "file".' });
    }

    const file = req.files.file as fileUpload.UploadedFile;
    if (file.mimetype !== "application/pdf") {
      return res.status(415).json({ error: "Only PDF files are supported." });
    }

    //Upload PDF On Cloudeflare R2

    const r2Url = await uploadPDFToR2(file.data, file.name);

    //Parse PDF using Llama
    const parsedPages = await parseWithLlamaCloud(file.data, file.name, {
      resultType: "markdown",
      pageSeparator: "\n===PAGE {pageNumber}===\n",
    });
    console.log("UploadController called");

    if (!parsedPages || parsedPages.length === 0) {
      return res.status(422).json({ error: "Parsing returned no content." });
    }

    const pdfId = await storeVectors(parsedPages, chunkText);

    // PDF Document Cration
    await PDF.create(
      [
        {
          title: file.name,
          path: r2Url,
          userId,
          pdfVectorId: pdfId,
        },
      ],
      { session }
    );

    const suggestions = await getSuggestions(parsedPages);

    await commitTransaction(session);

    return res
      .status(200)
      .json({ message: "Uploaded and indexed", pdfId, suggestions });
  } catch (err: any) {
    console.error("UploadController error:", err);
    await abortTransaction(session);
    return res.status(500).json({ error: err?.message || "Upload failed" });
  }
}

const getSuggestions = async (data: { page: number; text: string }[]) => {
  const contextArray = data.map((c) => ({ page: c.page, text: c.text }));
  const contextJSON = JSON.stringify(contextArray, null, 2);

  const system = `
You are an assistant that only uses the given context to generate suggestions.
Based on the provided context, suggest 3 relevant questions that someone might ask.
Return a JSON array of exactly 3 objects, each with:
- "question": A clear and concise question.
- "mentionedPages": A list of page numbers (from the "page" field) that directly support the question.

Important rules:
- Only use page numbers that appear in the "page" field of the context.
- Do not guess or invent page numbers.
- If no pages support a question, use an empty array for "mentionedPages".
Format:
[
  {
    "question": "Your question here?",
    "mentionedPages": [1, 2]
  },
  {
    "question": "Another question?",
    "mentionedPages": []
  },
  {
    "question": "Third question?",
    "mentionedPages": []
  }
]
`;

  const messages = [
    { role: "system", content: system },
    { role: "user", content: `Context:\n${contextJSON}` },
  ];

  const suggestions = await createChatSuggestions(messages, {
    temperature: 0.0,
    maxTokens: 1500,
  });

  return suggestions;
};
