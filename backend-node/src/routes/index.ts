import { Router } from "express";
// import userRoutes from "./userRoutes";
// import authRoutes from "./authRoutes";
import PythonApiRoutes from "./python.route";
import uploadRouter from './upload.route';
import askRouter from './ask.route';
import quizRouter from './quiz.route';
import progressRouter from './progress.route';
import userRouter from './userAuth.route'

const router = Router();

// router.use("/users", userRoutes);
// router.use("/auth", authRoutes);
router.use("/upload", uploadRouter);
router.use("/ask", askRouter);
router.use("/quiz", quizRouter);
router.use("/progress", progressRouter);
router.use("/python", PythonApiRoutes);
router.use("/user", userRouter);

export default router;
