import mongoose from "mongoose";

const PDFSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  docId: { type: String, required: true, unique: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("PDF", PDFSchema);
