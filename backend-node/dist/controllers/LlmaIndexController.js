"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPythonVersionPing = getPythonVersionPing;
exports.uploadPdfToPythonService = uploadPdfToPythonService;
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
async function getPythonVersionPing(req, res) {
    try {
        const response = await axiosConfig_1.default.get("/test");
        res.json({
            message: "backend-node",
            data: response.data,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function uploadPdfToPythonService(req, res) {
    try {
        const response = await axiosConfig_1.default.post("/upload", req.body);
        res.json({
            message: "PDF uploaded & processed successfully",
            data: response.data,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
