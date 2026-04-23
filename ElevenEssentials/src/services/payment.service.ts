import { api } from "./api.service";

export const PaymentService = {
  createOrder: (data: { amount: number; userId?: string; email: string; items: any[] }) => 
    api.post("/payments/create-order", data),
  
  verifyPayment: (data: any) => 
    api.post("/payments/verify-payment", data),

  getUserOrders: (userId: string) =>
    api.get(`/payments/user/${userId}`),

  getOrderDetails: (orderId: string) =>
    api.get(`/payments/${orderId}`)
};
