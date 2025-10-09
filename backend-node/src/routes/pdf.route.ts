import { Router } from "express";
import { getPDFListController } from "../controllers/pdf.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/list", authMiddleware, getPDFListController);
// router.get("/pdfs", getPdfService);

export default router;
