// services/dashboardService.ts
import api from "../config/axiosConfig";

export const getDashboardData = async (
  subject: string,
  type: string,
  fromDate: string,
  toDate: string
) => {
  const { data } = await api.get("/dashboard", {
    params: { subject, type, fromDate, toDate },
  });

//   console.log(data)
  return data;
};
