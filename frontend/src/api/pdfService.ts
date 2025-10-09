// services/pdfService.ts (Quick fix to match store: accept file, create FormData inside)
import api from "../config/axiosConfig";

export const getPDFs = async (page: number, limit: number) => {
  const data  = await api.get("/pdf/list", {
    params: { page, limit },
  });
//   console.log(data)
  return data;
};

export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const data  = await api.post("/upload", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};