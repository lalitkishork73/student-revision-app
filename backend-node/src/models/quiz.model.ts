// src/models/quiz.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  pdf: string;
  user: mongoose.Types.ObjectId;
  subject: string;
  type: "MCQ" | "SAQ" | "LAQ";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  attempted: boolean;
  createdAt: Date;
}

const QuizSchema = new Schema<IQuiz>({
  pdf: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String },
  type: { type: String, enum: ["MCQ", "SAQ", "LAQ"], required: true },
  question: { type: String, required: true },
  options: { type: [String] },
  answer: { type: String, required: true },
  explanation: { type: String },
  attempted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
