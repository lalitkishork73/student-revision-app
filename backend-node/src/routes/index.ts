import { Router } from "express";
// import userRoutes from "./userRoutes";
// import authRoutes from "./authRoutes";
// import productRoutes from "./productRoutes";
import PythonApiRoutes from "./pythonRoute"

const router = Router();

// Mount all sub-routes
// router.use("/users", userRoutes);
// router.use("/auth", authRoutes);
// router.use("/products", productRoutes);
router.use("/python", PythonApiRoutes);

export default router;
