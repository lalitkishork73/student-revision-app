import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/errorMiddleware";
import logger from "./utils/logger";
import connectDB from "./config/db";

// Import routes
// import userRoutes from "./routes/userRoutes";
// import authRoutes from "./routes/authRoutes";
// import productRoutes from "./routes/productRoutes";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ---------- Global Middlewares ---------- //

// Security HTTP headers
// app.use(helmet());

// Enable CORS
// app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// File upload support
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Request logging (morgan + winston)
interface MorganStream {
  write: (message: string) => void;
}

const morganStream: MorganStream = {
  write: (message: string) => logger.http(message.trim()),
};

app.use(
  morgan("dev", {
    stream: morganStream,
  })
);

// Rate limiter to prevent abuse
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ---------- Routes ---------- //
app.get("/", (req, res) => {
  res.send("Backend-Node (Express + TS) is running!");
});

// API routes
app.use("/api/v1", routes);

// ---------- Handle Wrong Routes ---------- //

// ---------- Error Handler ---------- //
app.use(errorHandler);

export default app;
