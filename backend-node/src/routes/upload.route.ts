import { Router } from "express";
import { handleUpload } from "../controllers/upload.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, handleUpload);
// router.get("/pdfs", getPdfService);

export default router;
