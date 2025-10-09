import { Router } from 'express';
import { generateQuiz, submitTestController} from '../controllers/quiz.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate', generateQuiz);
router.post('/submit', authMiddleware,submitTestController);

export default router;
