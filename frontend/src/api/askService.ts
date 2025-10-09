import api from "../config/axiosConfig";

export const ask = async (question: string, pdfId: string) => {
  const data = await api.post("/ask/", { question, pdfId });
  return data;
};
