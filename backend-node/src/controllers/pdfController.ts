import{ Request, Response } from "express";
import pdfModel from "../models/pdfModel.js";
import { downloadPDF, createIndex } from "../services/pdfService.js";

interface PythonResponse {
  message: string;
  data: any;
  docId: string;
}

interface ErrorResponse {
  error: string;
}

export async function uploadPdfService(
  req: Request,
  res: Response<PythonResponse | ErrorResponse>
): Promise<void> {
  try {
      const { url, docId, title } = req.body;
        const { filePath } = await downloadPDF(url, docId, title);
        await createIndex(docId, filePath);
        res.json({ message: "PDF uploaded & indexed successfully", docId });
   
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPdfService(
  req: Request,
  res: Response<PythonResponse | ErrorResponse>
): Promise<void> {
  try {
      const PDFs = await pdfModel.find();
  res.json({message: "PDFs retrieved successfully", data: PDFs, docId: ""});
   
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

