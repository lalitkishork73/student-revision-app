import { Request, Response } from 'express';
import { generateQuizFromPDF, gradeQuiz } from '../services/quizService';

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

export async function submitQuiz(req: Request, res: Response) {
  try {
    const { quizId, answers, userId,pdfId } = req.body;
    if (!quizId || !answers) return res.status(400).json({ error: 'Missing quizId or answers' });

    // const result = await gradeQuiz(pdfId,quizId, answers, quiztyp);
    let result={}
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Quiz submission error:', err);
    return res.status(500).json({ error: err.message || 'Quiz submission failed' });
  }
}
