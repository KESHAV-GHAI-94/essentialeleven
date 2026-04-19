import { api } from "./api.service";

export const DashboardService = {
  getStats: () => api.get("/admin/stats"),
  getSalesData: (period: string) => api.get(`/admin/sales-report?period=${period}`),
  getRecentOrders: () => api.get("/admin/recent-orders")
};
