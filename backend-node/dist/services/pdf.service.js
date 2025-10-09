"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPDFList = getPDFList;
// services/pdf.service.ts
const pdf_model_1 = __importDefault(require("../models/pdf.model"));
async function getPDFList(userId, filters, pagination) {
    try {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        // Build query
        const query = { userId };
        // Add filters if provided
        if (filters.subject) {
            query.subject = { $regex: filters.subject, $options: "i" };
        }
        if (filters.type) {
            query.type = filters.type;
        }
        // Date range filter
        if (filters.fromDate || filters.toDate) {
            query.createdAt = {};
            if (filters.fromDate) {
                query.createdAt.$gte = filters.fromDate;
            }
            if (filters.toDate) {
                query.createdAt.$lte = filters.toDate;
            }
        }
        // Execute query with pagination
        const [data, totalItems] = await Promise.all([
            pdf_model_1.default
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            pdf_model_1.default.countDocuments(query).exec(),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            success: true,
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    catch (error) {
        console.error("getPDFList service error:", error);
        return {
            success: false,
            data: [],
            pagination: {
                currentPage: 0,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 0,
                hasNextPage: false,
                hasPrevPage: false,
            },
            error: error.message || "Failed to fetch PDF list",
        };
    }
}
