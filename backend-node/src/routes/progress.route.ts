import { Router } from 'express';
import { getProgress, updateProgress } from '../controllers/progress.controller';

const router = Router();

router.get('/:userId', getProgress);
router.post('/update', updateProgress);

export default router;
