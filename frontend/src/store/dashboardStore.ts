// store/useDashboardStore.ts
import { create } from "zustand";
import { getDashboardData } from "@/api/dashboardService";

interface DashboardRecord {
  date: string;
  subject: string;
  type: string;
  totalMarks: number;
  attempts: number;
}

interface DashboardState {
  loading: boolean;
  error: string | null;
  data: DashboardRecord[];
  subject: string;
  type: string;
  fromDate: string;
  toDate: string;
  setFilters: (filters: Partial<Pick<DashboardState, "subject" | "type" | "fromDate" | "toDate">>) => void;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  loading: false,
  error: null,
  data: [],
  subject: "",
  type: "",
  fromDate: "",
  toDate: "",

  setFilters: (filters) => set(filters),

  fetchDashboard: async () => {
    const { subject, type, fromDate, toDate } = get();
    set({ loading: true, error: null });
    try {
      const response = await getDashboardData(subject, type, fromDate, toDate);
      console.log(response)
    
      set({ data: response || [], loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch dashboard data", loading: false });
    }
  },
}));
