import { api } from "./api.service";

export const BrandService = {
  getAll: () => api.get("/admin/brands"),
  create: (data: any) => api.post("/admin/brands", data),
  update: (id: string, data: any) => api.patch(`/admin/brands/${id}`, data),
  delete: (id: string) => api.delete(`/admin/brands/${id}`)
};
