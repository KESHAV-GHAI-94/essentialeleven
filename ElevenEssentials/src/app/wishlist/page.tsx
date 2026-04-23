"use client";

import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, Heart, ArrowLeft, ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const [movedItems, setMovedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    removeItem(item.id);
    setMovedItems((prev) => new Set([...prev, item.id]));
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addItem({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });
    });
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-navy-50/30 py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <h1 className="text-4xl font-black text-navy-900 tracking-tight">My Wishlist</h1>
            </div>
            <p className="text-navy-400 font-medium pl-1">
              {items.length === 0
                ? "Your wishlist is empty"
                : `${items.length} item${items.length > 1 ? "s" : ""} saved`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/shop">
              <Button variant="ghost" className="text-navy-600 font-bold px-0 hover:bg-transparent hover:text-navy-900 flex gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
              </Button>
            </Link>
            {items.length > 1 && (
              <Button
                onClick={handleMoveAllToCart}
                className="bg-navy-900 hover:bg-black text-white rounded-xl px-6 h-11 font-bold flex gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" /> Move All to Cart
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-24 text-center flex flex-col items-center justify-center border border-navy-100 shadow-sm">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-red-50 rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-red-200" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-3">Nothing saved yet</h2>
            <p className="text-navy-400 mb-10 max-w-sm font-medium leading-relaxed">
              Browse our collection and tap the ♡ heart icon on any product to save it here for later.
            </p>
            <Link href="/shop">
              <Button className="bg-navy-900 text-white rounded-xl px-10 h-14 font-bold text-lg flex gap-2 hover:bg-black transition-all hover:scale-[1.02] shadow-lg">
                Discover Products <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-navy-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex"
              >
                {/* Image */}
                <Link href={`/shop/${item.id}`} className="relative w-36 shrink-0 bg-navy-50 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-10 h-10 text-navy-200" />
                    </div>
                  )}
                  {item.discount && item.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {item.discount}% OFF
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-navy-400 font-bold mb-1">
                      {item.category}
                    </p>
                    <Link href={`/shop/${item.id}`}>
                      <h3 className="font-bold text-navy-900 text-base leading-tight line-clamp-2 hover:text-navy-600 transition-colors mb-3">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2.5">
                      <p className="font-extrabold text-navy-900 text-xl">
                        ₹{item.price.toLocaleString()}
                      </p>
                      {item.mrp && item.mrp > item.price && (
                        <p className="text-sm font-medium text-navy-300 line-through">
                          ₹{item.mrp.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 bg-navy-900 hover:bg-black text-white rounded-xl h-10 font-bold text-sm flex gap-2 transition-all hover:scale-[1.02]"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </Button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2.5 rounded-xl border border-navy-100 text-navy-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl border border-navy-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-widest text-navy-400 font-bold mb-1">
                Total Wishlist Value
              </p>
              <p className="text-3xl font-black text-navy-900">
                ₹{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={clearWishlist}
                variant="outline"
                className="border-navy-200 text-navy-600 rounded-xl h-11 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                Clear All
              </Button>
              <Button
                onClick={handleMoveAllToCart}
                className="bg-saffron hover:bg-yellow-500 text-navy-900 rounded-xl h-11 px-6 font-bold flex gap-2 transition-all hover:scale-[1.02] shadow-md"
              >
                <ShoppingBag className="w-4 h-4" /> Move All to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
