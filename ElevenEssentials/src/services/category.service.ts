import { api } from "./api.service";

export const CategoryService = {
  getAll: () => api.get("/admin/categories"),
  create: (data: any) => api.post("/admin/categories", data),
  update: (id: string, data: any) => api.post(`/admin/categories/${id}`, data),
  delete: (id: string) => api.delete(`/admin/categories/${id}`)
};
