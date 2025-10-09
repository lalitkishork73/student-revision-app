// lib/axios.ts
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";

const URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor → always grab token from Zustand
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
      return Promise.reject(
        new Error(typeof data === "string" ? data : JSON.stringify(data))
      );
    }
    if (error.request) return Promise.reject(new Error("No response from server"));
    return Promise.reject(new Error(error.message));
  }
);

export default axiosInstance;
