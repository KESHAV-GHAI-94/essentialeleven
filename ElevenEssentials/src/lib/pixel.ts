export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const trackPixel = (event: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    if (params) {
      window.fbq("track", event, params);
    } else {
      window.fbq("track", event);
    }
  }
};

export const trackAddToCart = (item: any) => {
  trackPixel("AddToCart", {
    content_name: item.name,
    content_ids: [item.productId],
    content_type: "product",
    value: item.price,
    currency: "INR"
  });
};

export const trackInitiateCheckout = (total: number, itemsCount: number) => {
  trackPixel("InitiateCheckout", {
    value: total,
    currency: "INR",
    num_items: itemsCount
  });
};

export const trackPurchase = (total: number, orderId: string) => {
  trackPixel("Purchase", {
    value: total,
    currency: "INR",
    transaction_id: orderId
  });
};
