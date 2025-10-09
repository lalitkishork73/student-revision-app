// types/pdf.types.ts
import { Types } from "mongoose";

export interface PdfFilters {
  subject?: string;
  type?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PdfDocument {
  _id: Types.ObjectId | string;
  title: string;
  path: string;
  userId: Types.ObjectId | string;
  pdfVectorId: string;
  createdAt: Date;
  __v?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}