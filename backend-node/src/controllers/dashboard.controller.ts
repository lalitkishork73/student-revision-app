import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.service";

export async function getDashboardController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const { subject, type, fromDate, toDate } = req.query;

    const filters = {
      subject: subject ? String(subject) : undefined,
      type: type ? (String(type) as any) : undefined,
      fromDate: fromDate ? new Date(String(fromDate)) : undefined,
      toDate: toDate ? new Date(String(toDate)) : undefined,
    };

    const result = await getDashboardData(userId, filters);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: "Dashboard data fetched successfully",
      data: result.data,
    });
  } catch (err: any) {
    console.error("getDashboardController fatal error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
