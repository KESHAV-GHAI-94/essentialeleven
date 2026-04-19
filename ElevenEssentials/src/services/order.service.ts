import { api } from "./api.service";

export const OrderService = {
  getAllOrders: (params?: any) => api.get(`/admin/orders`),
  getOrderById: (id: string) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => api.post(`/admin/orders/${id}/status`, { status }),
  deleteOrder: (id: string) => api.delete(`/admin/orders/${id}`)
};
