import { Schema, model, Types, Document } from "mongoose";

export interface ITest extends Document {
  user: Types.ObjectId;
  subject: string;
  type: "MCQ" | "SAQ" | "LAQ" | "mixed";
  questions: Types.ObjectId[]; // references Question collection
  answers: { questionId: Types.ObjectId; selectedOption: string; correct: boolean; marks: number }[];
  total: number;  // total marks obtained
  createdAt: Date;
}

const TestSchema = new Schema<ITest>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: "Question" },
    selectedOption: { type: String },
    correct: { type: Boolean },
    marks: { type: Number },
  }],
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default model<ITest>("Test", TestSchema);
