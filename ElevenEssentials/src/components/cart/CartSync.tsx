"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";

export function CartSync() {
  const { data: session } = useSession();
  const { items, syncWithDb, setItems } = useCartStore();
  
  // 1. Initial Load: Fetch cart from DB when user logs in if local cart is empty
  useEffect(() => {
    if (session?.user?.id && items.length === 0) {
       const fetchCart = async () => {
         try {
           const res = await fetch(`http://localhost:4000/api/cart/${session.user.id}`);
           const data = await res.json();
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
         } catch (error) {
           console.error("Fetch DB Cart Error:", error);
         }
       };
       fetchCart();
    }
  }, [session?.user?.id]);

  // 2. Sync to DB: Save cart to DB whenever it changes and user is logged in
  useEffect(() => {
    if (session?.user?.id) {
      syncWithDb(session.user.id);
    }
  }, [items, session?.user?.id]);

  return null;
}
