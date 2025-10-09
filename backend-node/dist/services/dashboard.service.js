"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = getDashboardData;
const test_model_1 = __importDefault(require("../models/test.model"));
const mongoose_1 = require("mongoose");
async function getDashboardData(userId, filters) {
    try {
        const match = { user: new mongoose_1.Types.ObjectId(userId) };
        console.log(userId);
        // subject filter
        if (filters.subject)
            match.subject = filters.subject;
        // type filter
        if (filters.type)
            match.type = filters.type;
        // date filter
        if (filters.fromDate && filters.toDate) {
            match.createdAt = { $gte: filters.fromDate, $lte: filters.toDate };
        }
        // default: last 30 days if no filter
        if (!filters.fromDate && !filters.toDate) {
            match.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        }
        // Aggregate by date (day wise marks)
        const result = await test_model_1.default.aggregate([
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
        console.log(result);
        // Reformat for frontend (Recharts friendly)
        const formatted = result.map(r => ({
            date: r._id.day,
            subject: r._id.subject,
            type: r._id.type,
            totalMarks: r.totalMarks,
            attempts: r.attempts
        }));
        return { success: true, data: formatted };
    }
    catch (err) {
        console.error("getDashboardData error:", err);
        return { success: false, error: err.message };
    }
}
