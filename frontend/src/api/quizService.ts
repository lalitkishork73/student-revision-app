// services/pdfService.ts
import api from "../config/axiosConfig";

export const submitQuiz = async (data: any) => {
  const res = await api.post("/quiz/submit", data);
  return res;
};

export const generateQuiz = async (data: any) => {
    console.log(data)
  const res = await api.post("/quiz/generate", data);
  return res;
};
