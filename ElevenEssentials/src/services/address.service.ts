import { api } from "./api.service";

export const AddressService = {
  getSavedAddresses: (userId: string) => api.get(`/addresses/user/${userId}`),
  addAddress: (data: any) => api.post("/addresses", data),
  deleteAddress: (id: string) => api.delete(`/addresses/${id}`)
};
