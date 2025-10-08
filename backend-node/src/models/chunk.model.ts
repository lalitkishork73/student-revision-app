// src/models/chunk.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChunk extends Document {
  pdf: mongoose.Types.ObjectId;
  content: string;
  pageNumber: number;
  embedding?: number[];
  createdAt: Date;
}

const ChunkSchema = new Schema<IChunk>({
  pdf: { type: Schema.Types.ObjectId, ref: "PDF", required: true },
  content: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  embedding: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChunk>("Chunk", ChunkSchema);
