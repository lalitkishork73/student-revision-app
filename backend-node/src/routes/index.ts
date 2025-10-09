import { Router } from "express";

import PythonApiRoutes from "./python.route";
import uploadRouter from "./upload.route";
import askRouter from "./ask.route";
import quizRouter from "./quiz.route";
import userRouter from "./userAuth.route";
import dashboardRouter from "./dashboard.route";
import pdfRouter from "./pdf.route";

const router = Router();

router.use("/upload", uploadRouter);
router.use("/ask", askRouter);
router.use("/quiz", quizRouter);
router.use("/python", PythonApiRoutes);
router.use("/user", userRouter);
router.use("/dashboard", dashboardRouter);
router.use("/pdf", pdfRouter);

export default router;
