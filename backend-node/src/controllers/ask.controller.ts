import { Request, Response } from 'express';
import { retrieveAnswer } from '../services/ragPipeline';

export async function handleAsk(req: Request, res: Response) {
  try {
    const { pdfId, question } = req.body;
    if (!pdfId || !question) {
      return res.status(400).json({ error: 'Missing pdfId or question' });
    }
    console.log("isit wkri")
    

    const result = await retrieveAnswer(pdfId, question, { topK: 4 });
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('AskController error:', err);
    return res.status(500).json({ error: err.message || 'Ask failed' });
  }
}
