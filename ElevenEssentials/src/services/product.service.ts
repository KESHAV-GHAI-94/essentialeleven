import { api } from "./api.service";

export const ProductService = {
  getAllProducts: () => api.get("/admin/products"),
  createProduct: (data: any) => api.post("/admin/products", data),
  updateProduct: (id: string, data: any) => api.post(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`)
};
