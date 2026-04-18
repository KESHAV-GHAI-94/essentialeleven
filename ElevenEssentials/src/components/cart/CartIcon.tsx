"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "./CartSheet";

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-navy-400 rounded-full transition-colors relative group">
          <ShoppingBag className="w-5 h-5 text-saffron group-hover:scale-110 transition-transform" />
          {mounted && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-navy-900 rounded-full text-[11px] flex items-center justify-center font-bold shadow-sm animate-in zoom-in">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <CartSheet />
    </Sheet>
  );
}
