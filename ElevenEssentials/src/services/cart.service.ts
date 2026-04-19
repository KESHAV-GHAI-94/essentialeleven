import { api } from "./api.service";

export const CartService = {
  fetchCart: (userId: string) => api.get(`/cart/${userId}`),
  syncCart: (userId: string, items: any[]) => 
    api.post("/cart/sync", { 
      userId, 
      items: items.map(i => ({
        variantId: i.id.includes('-') ? i.id.split('-')[1] : i.id,
        quantity: i.quantity
      }))
    })
};
