import { Router } from "express";
// import userRoutes from "./userRoutes";
// import authRoutes from "./authRoutes";
// import productRoutes from "./productRoutes";
import PythonApiRoutes from "./pythonRoute"
import pdfRoutes from "./pdfRoute";

const router = Router();

// router.use("/users", userRoutes);
// router.use("/auth", authRoutes);
// router.use("/products", productRoutes);
router.use("/pdf", pdfRoutes);
router.use("/python", PythonApiRoutes);

export default router;
