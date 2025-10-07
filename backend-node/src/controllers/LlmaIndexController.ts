import axiosInstance from "../config/axiosConfig";
import { Request, Response } from "express";
interface PythonResponse {
  message: string;
  data: any;
}

interface ErrorResponse {
  error: string;
}

export async function getPythonVersionPing(
  req: Request,
  res: Response<PythonResponse | ErrorResponse>
): Promise<void> {
  try {
    const response = await axiosInstance.get("/test");
    res.json({
      message: "backend-node",
      data: response.data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function uploadPdfToPythonService(req:Request,res:Response):Promise<void>{
    try {
        const response = await axiosInstance.post("/upload", req.body);
        res.json({
            message: "PDF uploaded & processed successfully",
            data: response.data,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}