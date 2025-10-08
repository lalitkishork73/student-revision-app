// src/models/pdf.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPDF extends Document {
  title: string;
  path: string; // file path or S3 url
  userId: mongoose.Types.ObjectId;
  pdfVectorId: string;
  createdAt: Date;
}

const PDFSchema = new Schema<IPDF>({
  title: { type: String, required: true },
  path: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pdfVectorId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPDF>("PDF", PDFSchema);
