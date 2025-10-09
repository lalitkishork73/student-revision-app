// services/authService.ts
import api from "../config/axiosConfig";

export const signup = async (name: string, email: string, password: string) => {
  const data = await api.post("/user/signup", { name, email, password });
  return data;
};

export const login = async (email: string, password: string) => {
  const data = await api.post("/user/login", { email, password });
  return data;
};
