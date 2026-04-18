"use client";

import { useCartStore } from "@/store/cart";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

export function CartSheet() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  return (
    <SheetContent className="flex flex-col w-full sm:max-w-md bg-white border-l border-navy-100 p-0">
      <SheetHeader className="p-6 border-b border-navy-50">
        <SheetTitle className="flex items-center gap-2 text-navy-900 font-bold">
          <ShoppingBag className="w-5 h-5 text-saffron" />
          Shopping Cart ({items.length})
        </SheetTitle>
      </SheetHeader>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <ShoppingBag className="w-16 h-16 text-navy-200" />
            <p className="text-navy-600 font-medium">Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="relative w-24 h-28 bg-navy-50 rounded-lg overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="font-bold text-navy-900 leading-tight mb-1">{item.name}</h4>
                  <p className="text-saffron font-bold">₹{item.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-navy-100 rounded-md bg-navy-50/50">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:text-saffron transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-2 text-sm font-bold min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-saffron transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-navy-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <SheetFooter className="p-6 border-t border-navy-50 bg-navy-50/20">
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-navy-600 font-medium">Subtotal</span>
            <span className="text-2xl font-bold text-navy-900">₹{getCartTotal().toLocaleString()}</span>
          </div>
          <Button className="w-full bg-navy hover:bg-navy-800 text-white py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-navy-200 transition-all">
            Secure Checkout
          </Button>
          <p className="text-center text-[11px] text-navy-400">
            Taxes and shipping calculated at checkout.
          </p>
        </div>
      </SheetFooter>
    </SheetContent>
  );
}
