"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = handleUpload;
const llamaparseService_1 = require("../services/llamaparseService");
const openaiService_1 = require("../services/openaiService");
const vectorStore_1 = require("../services/vectorStore");
const chunkText_1 = require("../utils/chunkText");
const r2Service_1 = require("../services/r2Service");
const pdf_model_1 = __importDefault(require("../models/pdf.model"));
const db_1 = require("../config/db");
async function handleUpload(req, res) {
    const session = await (0, db_1.startSession)();
    try {
        const userId = req.user.id; // from authMiddleware
        if (!req?.files?.file) {
            return res
                .status(400)
                .json({ error: 'No file uploaded. Use field name "file".' });
        }
        const file = req.files.file;
        if (file.mimetype !== "application/pdf") {
            return res.status(415).json({ error: "Only PDF files are supported." });
        }
        //Upload PDF On Cloudeflare R2
        const r2Url = await (0, r2Service_1.uploadPDFToR2)(file.data, file.name);
        //Parse PDF using Llama
        const parsedPages = await (0, llamaparseService_1.parseWithLlamaCloud)(file.data, file.name, {
            resultType: "markdown",
            pageSeparator: "\n===PAGE {pageNumber}===\n",
        });
        console.log("UploadController called");
        if (!parsedPages || parsedPages.length === 0) {
            return res.status(422).json({ error: "Parsing returned no content." });
        }
        const pdfId = await (0, vectorStore_1.storeVectors)(parsedPages, chunkText_1.recursiveChunk);
        // PDF Document Cration
        await pdf_model_1.default.create([
            {
                title: file.name,
                path: r2Url,
                userId,
                pdfVectorId: pdfId,
            },
        ], { session });
        const suggestions = await getSuggestions(parsedPages);
        await (0, db_1.commitTransaction)(session);
        return res
            .status(200)
            .json({ message: "Uploaded and indexed", pdfId, suggestions });
    }
    catch (err) {
        console.error("UploadController error:", err);
        await (0, db_1.abortTransaction)(session);
        return res.status(500).json({ error: err?.message || "Upload failed" });
    }
}
const getSuggestions = async (data) => {
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
    const suggestions = await (0, openaiService_1.createChatSuggestions)(messages, {
        temperature: 0.0,
        maxTokens: 1500,
    });
    return suggestions;
};
