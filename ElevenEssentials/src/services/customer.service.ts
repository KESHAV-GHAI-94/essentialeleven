import { api } from "./api.service";

export const CustomerService = {
  getAllCustomers: () => api.get("/admin/customers"),
  getCustomerDetails: (id: string) => api.get(`/admin/customers/${id}`),
  updateCustomerStatus: (id: string, status: string) => api.post(`/admin/customers/${id}/status`, { status }),
};
