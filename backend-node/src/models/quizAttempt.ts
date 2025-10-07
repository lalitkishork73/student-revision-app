import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "PDF", required: true },
  score: { type: Number },
  answers: { type: Array },
  date: { type: Date, default: Date.now }
},{ timestamps: true });

export default mongoose.model("QuizAttempt", QuizAttemptSchema);
