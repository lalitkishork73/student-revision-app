import { Request, Response } from 'express';
import { generateQuizFromPDF } from '../services/quizService';
import {submitTest} from "../services/submittest.service";

export async function generateQuiz(req: Request, res: Response) {
  try {
    const { pdfId, quizType } = req.body;
    if (!pdfId || !quizType) return res.status(400).json({ error: 'Missing pdfId or quizType' });

    const quiz = await generateQuizFromPDF(pdfId, quizType,'68e63fb51fd04e4d2d821bc8');
    return res.status(200).json({ quiz });
  } catch (err: any) {
    console.error('Quiz generation error:', err);
    return res.status(500).json({ error: err.message || 'Quiz generation failed' });
  }
}



export async function submitTestController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { subject, type, answers } = req.body;
    // console.log(userId)

    if (!subject || !type || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    // console.log(subject)

    const test = await submitTest(userId, subject, type, answers);
    // console.log(test)
    return res.status(201).json({ message: "Test submitted", test });
  } catch (err: any) {
    console.error("submitTestController error:", err);
    return res.status(500).json({ error: err.message });
  }
}

