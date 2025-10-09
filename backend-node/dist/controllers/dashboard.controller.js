"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardController = getDashboardController;
const dashboard_service_1 = require("../services/dashboard.service");
async function getDashboardController(req, res) {
    try {
        const userId = req.user.id;
        const { subject, type, fromDate, toDate } = req.query;
        const filters = {
            subject: subject ? String(subject) : undefined,
            type: type ? String(type) : undefined,
            fromDate: fromDate ? new Date(String(fromDate)) : undefined,
            toDate: toDate ? new Date(String(toDate)) : undefined,
        };
        const result = await (0, dashboard_service_1.getDashboardData)(userId, filters);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({
            message: "Dashboard data fetched successfully",
            data: result.data,
        });
    }
    catch (err) {
        console.error("getDashboardController fatal error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
