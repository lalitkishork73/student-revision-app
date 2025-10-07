import { Router } from "express";
import { getPythonVersionPing } from "../controllers/LlmaIndexController";
const router = Router();

router.get("/ping", getPythonVersionPing);

export default router;
