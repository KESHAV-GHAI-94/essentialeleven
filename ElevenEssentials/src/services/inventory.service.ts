import { api } from "./api.service";

export const InventoryService = {
  getInventory: () => api.get("/admin/inventory"),
  updateStock: (variantId: string, stock: number) => api.post(`/admin/inventory/${variantId}/stock`, { stock }),
  getLowStockAlerts: () => api.get("/admin/inventory/low-stock")
};
