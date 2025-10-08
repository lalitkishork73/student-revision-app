import { Router } from "express";
import { handleAsk } from '../controllers/ask.controller';
const router = Router();
router.post('/', handleAsk);

export default router;
