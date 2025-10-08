// src/models/progress.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  pdf: mongoose.Types.ObjectId;
  attempts: {
    quizType: "MCQ" | "SAQ" | "LAQ";
    quiz: mongoose.Types.ObjectId;
    score: number;
    total: number;
    attemptedAt: Date;
  }[];
}

const ProgressSchema = new Schema<IProgress>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pdf: { type: Schema.Types.ObjectId, ref: "PDF", required: true },
  attempts: [
    {
      quizType: { type: String, enum: ["MCQ", "SAQ", "LAQ"], required: true },
      quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
      score: { type: Number, required: true },
      total: { type: Number, required: true },
      attemptedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<IProgress>("Progress", ProgressSchema);
