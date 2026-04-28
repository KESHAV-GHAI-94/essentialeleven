"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, savedItems, removeItem, updateQuantity, getCartTotal, moveToSaveForLater, moveToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getCartTotal();
  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "ESSENTIAL10") {
      setDiscountAmount(Math.round(subtotal * 0.1));
      setIsCouponApplied(true);
    } else {
      alert("Invalid coupon code");
    }
  };

  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round((subtotal - discountAmount) * 0.18);
  const total = subtotal - discountAmount + shipping;

  return (
    <div className="min-h-screen bg-navy-50/30 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Shopping Cart</h1>
            <p className="text-navy-400 font-medium">You have <span className="text-navy-900 font-bold">{items.length} items</span> in your cart</p>
          </div>
          <Link href="/shop">
            <Button variant="ghost" className="text-navy-600 font-bold px-0 hover:bg-transparent hover:text-navy-900 flex gap-2">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center flex flex-col items-center justify-center border border-navy-100 shadow-sm">
                <div className="w-20 h-20 bg-navy-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-navy-200" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Your cart is empty</h2>
                <p className="text-navy-400 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/shop">
                  <Button className="bg-navy-900 text-white rounded-xl px-10 h-14 font-bold text-lg">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row gap-6 border border-navy-51 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative w-full sm:w-32 aspect-square bg-navy-50 rounded-xl overflow-hidden shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl text-navy-900 leading-tight mb-1">{item.name}</h3>
                        <p className="text-xs font-bold text-navy-400 uppercase tracking-widest">Premium Essential</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-navy-200 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                      <div className="flex items-center gap-6">
                        {/* Quantity UI */}
                        <div className="flex items-center border-2 border-navy-50 rounded-xl bg-white overflow-hidden shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-3 text-navy-400 hover:bg-navy-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-black text-navy-900 border-x border-navy-50">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-3 text-navy-400 hover:bg-navy-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => moveToSaveForLater(item.id)}
                          className="text-xs font-bold text-navy-400 hover:text-navy-900 transition-colors uppercase tracking-widest border-b border-navy-100 pb-0.5"
                        >
                          Save for Later
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-tighter mb-1">Total Price</p>
                        <p className="text-2xl font-black text-navy-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Save for Later Section */}
            {savedItems.length > 0 && (
              <div className="mt-16 space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-navy-900">Saved for Later</h2>
                  <span className="bg-navy-100 text-navy-600 text-xs font-bold px-2 py-0.5 rounded-full">{savedItems.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="bg-white/60 rounded-2xl p-4 flex gap-4 border border-navy-50 group">
                      <div className="relative w-20 h-20 bg-navy-50 rounded-lg overflow-hidden shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                      </div>
                      <div className="flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-bold text-navy-900 text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs font-bold text-saffron">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => moveToCart(item.id)} className="text-[10px] font-bold text-navy-900 uppercase tracking-wider hover:text-saffron transition-colors">Move to Cart</button>
                          <button onClick={() => removeItem(item.id)} className="text-[10px] font-bold text-red-400 uppercase tracking-wider hover:text-red-600 transition-colors">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary Card */}
          <div className="space-y-6">
            <div className="bg-navy-900 rounded-3xl p-8 text-white shadow-2xl sticky top-28">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                Order Summary
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between text-navy-300 font-medium">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">₹{subtotal.toLocaleString()}</span>
                </div>

                {isCouponApplied && (
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Discount (10%)</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-navy-300 font-medium">
                  <span>Shipping</span>
                  <span className={`${shipping === 0 ? 'text-green-400' : 'text-white'} font-bold`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-navy-300 font-medium">
                  <div className="flex flex-col">
                    <span>GST (18%)</span>
                    <span className="text-[10px] opacity-50">Included in total</span>
                  </div>
                  <span className="text-white font-bold">₹{tax.toLocaleString()}</span>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-saffron uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-4xl font-black">₹{total.toLocaleString()}</p>
                  </div>
                </div>

                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-saffron hover:bg-saffron-400 text-navy-900 h-16 rounded-2xl font-extrabold text-xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 mt-6">
                    Checkout Now
                  </Button>
                </Link>

                <div className="flex flex-col gap-3 pt-6 border-t border-white/5 opacity-60">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide uppercase">
                    <ShieldCheck className="w-4 h-4 text-saffron" /> Secure SSL Encryption
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide uppercase">
                    <Truck className="w-4 h-4 text-saffron" /> Express Delivery Available
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">Have a Promo Code?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  className="flex-1 bg-navy-50 border-none rounded-xl px-4 text-xs font-bold focus:ring-1 focus:ring-saffron"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button
                  variant="outline"
                  className={`rounded-xl border-navy-200 font-bold ${isCouponApplied ? 'bg-green-50 text-green-600' : 'hover:bg-navy-50'}`}
                  onClick={handleApplyCoupon}
                  disabled={isCouponApplied}
                >
                  {isCouponApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
