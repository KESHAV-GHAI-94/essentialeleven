import { api } from "./api.service";

export const VendorService = {
  getAll: () => api.get("/admin/vendors"),
  updateStatus: (id: string, isActive: boolean) => api.post(`/admin/vendors/${id}/status`, { isActive }),
  create: (data: any) => api.post("/admin/vendors", data)
};
