"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { CartService } from "@/services/cart.service";

export function CartSync() {
  const { data: session } = useSession();
  const { items, setItems } = useCartStore();
  
  // 1. Initial Load: Fetch cart from DB when user logs in if local cart is empty
  useEffect(() => {
    if (session?.user?.id && items.length === 0) {
       CartService.fetchCart(session.user.id).then(data => {
          if (data && data.items) {
             const mappedItems = data.items.map((i: any) => ({
                id: `${i.variant.productId}-${i.variant.id}`,
                productId: i.variant.productId,
                name: i.variant.product.name,
                price: i.variant.price,
                image: i.variant.product.images[0],
                quantity: i.quantity,
                attributes: i.variant.attributes
             }));
             setItems(mappedItems);
          }
       }).catch(console.error);
    }
  }, [session?.user?.id]);

  // 2. Sync to DB: Save cart to DB whenever it changes and user is logged in
  useEffect(() => {
    if (session?.user?.id) {
      CartService.syncCart(session.user.id, items).catch(console.error);
    }
  }, [items, session?.user?.id]);

  return null;
}
