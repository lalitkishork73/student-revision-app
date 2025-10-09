import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: { name: string; email: string; avatar?: string } | null; // avatar is optional
  login: (token: string, user: { name: string; email: string; avatar?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
    login: (token, user) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ token, user });
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });
    },
  };
});
