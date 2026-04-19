import { api } from "./api.service";

export const PaymentService = {
  createOrder: (data: { amount: number; userId?: string; email: string; items: any[] }) => 
    api.post("/payments/create-order", data),
  
  verifyPayment: (data: any) => 
    api.post("/payments/verify-payment", data)
};
