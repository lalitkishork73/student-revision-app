// controllers/pdf.controller.ts
import { Request, Response } from "express";
import { getPDFList } from "../services/pdf.service";

export async function getPDFListController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    // Extract query parameters
    const { subject, type, fromDate, toDate, page = "1", limit = "10" } = req.query;

    // Validate pagination params
    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10))); // Max 100 items per page

    // Build filters
    const filters = {
      subject: subject ? String(subject) : undefined,
      type: type ? String(type) : undefined,
      fromDate: fromDate ? new Date(String(fromDate)) : undefined,
      toDate: toDate ? new Date(String(toDate)) : undefined,
    };

    // Validate dates
    if (filters.fromDate && isNaN(filters.fromDate.getTime())) {
      return res.status(400).json({ error: "Invalid fromDate format" });
    }
    if (filters.toDate && isNaN(filters.toDate.getTime())) {
      return res.status(400).json({ error: "Invalid toDate format" });
    }

    // Call service
    const result = await getPDFList(userId, filters, {
      page: pageNum,
      limit: limitNum,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: "PDF list fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err: any) {
    console.error("getPDFListController fatal error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}