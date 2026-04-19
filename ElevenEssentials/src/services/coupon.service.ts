import { api } from "./api.service";

export const CouponService = {
  getAll: () => api.get("/admin/coupons"),
  create: (data: any) => api.post("/admin/coupons", data),
  delete: (id: string) => api.delete(`/admin/coupons/${id}`)
};
