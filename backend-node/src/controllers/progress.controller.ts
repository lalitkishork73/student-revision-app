import { Request, Response } from 'express';
import progressModel from '../models/progress.model';
export async function getProgress(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const progress = await progressModel.findOne({ userId });
    return res.status(200).json({ progress });
  } catch (err: any) {
    console.error('Get progress error:', err);
    return res.status(500).json({ error: err.message || 'Failed to get progress' });
  }
}

export async function updateProgress(req: Request, res: Response) {
  try {
    const { userId, updates } = req.body;
    if (!userId || !updates) return res.status(400).json({ error: 'Missing userId or updates' });

    const progress = await progressModel.findOneAndUpdate({ userId }, updates, { new: true });
    return res.status(200).json({ progress });
  } catch (err: any) {
    console.error('Update progress error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update progress' });
  }
}
