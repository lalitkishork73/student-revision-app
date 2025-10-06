import axios from "axios";
import { Router } from "express";
import { Request, Response } from "express";
const router = Router();
interface PythonResponse {
    service: string;
    pythonResponse: any;
}

interface ErrorResponse {
    error: string;
}

export async function getPythonVersion(
    req: Request,
    res: Response<PythonResponse | ErrorResponse>
): Promise<void> {
    try {
        const response = await axios.get("http://localhost:8000/test");
        res.json({
            service: "backend-node",
            pythonResponse: response.data,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}