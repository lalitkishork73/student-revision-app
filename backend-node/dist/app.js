"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const index_1 = __importDefault(require("./routes/index"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = __importDefault(require("./config/db"));
// Import routes
// import userRoutes from "./routes/userRoutes";
// import authRoutes from "./routes/authRoutes";
// import productRoutes from "./routes/productRoutes";
dotenv_1.default.config();
// Connect Database
(0, db_1.default)();
const app = (0, express_1.default)();
// ---------- Global Middlewares ---------- //
// Security HTTP headers
// app.use(helmet());
// Enable CORS
app.use((0, cors_1.default)());
// Parse JSON body
app.use(express_1.default.json());
// Parse URL-encoded data
app.use(express_1.default.urlencoded({ extended: true }));
// File upload support
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
const morganStream = {
    write: (message) => logger_1.default.http(message.trim()),
};
app.use((0, morgan_1.default)("dev", {
    stream: morganStream,
}));
// Rate limiter to prevent abuse
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
}));
// ---------- Routes ---------- //
app.get("/", (req, res) => {
    res.send("Backend-Node (Express + TS) is running!");
});
// API routes
app.use("/api/v1", index_1.default);
// ---------- Handle Wrong Routes ---------- //
// ---------- Error Handler ---------- //
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
