import Test from "../models/test.model";
import { Types } from "mongoose";

interface DashboardFilter {
  subject?: string;
  type?: "MCQ" | "SAQ" | "LAQ" | "mixed";
  fromDate?: Date;
  toDate?: Date;
}

export async function getDashboardData(userId: string, filters: DashboardFilter) {
  try {
    const match: any = { user: new Types.ObjectId(userId) };
    console.log(userId)

    // subject filter
    if (filters.subject) match.subject = filters.subject;

    // type filter
    if (filters.type) match.type = filters.type;

    // date filter
    if (filters.fromDate && filters.toDate) {
      match.createdAt = { $gte: filters.fromDate, $lte: filters.toDate };
    }

    // default: last 30 days if no filter
    if (!filters.fromDate && !filters.toDate) {
      match.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    // Aggregate by date (day wise marks)
    const result = await Test.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            subject: "$subject",
            type: "$type"
          },
          totalMarks: { $sum: "$total" },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    console.log(result)

    // Reformat for frontend (Recharts friendly)
    const formatted = result.map(r => ({
      date: r._id.day,
      subject: r._id.subject,
      type: r._id.type,
      totalMarks: r.totalMarks,
      attempts: r.attempts
    }));

    return { success: true, data: formatted };
  } catch (err: any) {
    console.error("getDashboardData error:", err);
    return { success: false, error: err.message };
  }
}
