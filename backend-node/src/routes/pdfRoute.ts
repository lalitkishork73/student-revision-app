import { Router } from "express";
import { uploadPdfService, getPdfService } from "../controllers/pdfController";

const router = Router();

router.post("/upload-pdf", uploadPdfService);
router.get("/pdfs", getPdfService);

export default router;
