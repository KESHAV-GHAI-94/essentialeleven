import { api } from "./api.service";

export const ShippingService = {
  getEstimates: (pincode: string) => api.get(`/shipping/estimate-pincode?pincode=${pincode}`)
};
