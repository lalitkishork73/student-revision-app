// services/pdf.service.ts
import pdfModel from "../models/pdf.model";

interface PdfFilters {
  subject?: string;
  type?: string;
  fromDate?: Date;
  toDate?: Date;
}

interface PaginationParams {
  page: number;
  limit: number;
}

export async function getPDFList(
  userId: string,
  filters: PdfFilters,
  pagination: PaginationParams
) {
  try {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { userId };

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
      pdfModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      pdfModel.countDocuments(query).exec(),
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
  } catch (error: any) {
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