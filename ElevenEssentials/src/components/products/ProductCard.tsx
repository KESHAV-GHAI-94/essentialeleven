"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useRecentlyViewed } from "@/store/recently-viewed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { trackAddToCart } from "@/lib/pixel";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  category: string;
  badges?: string[];
  discount?: number;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const addRecent = useRecentlyViewed((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    trackAddToCart(product);
  };

  const handleView = () => {
    addRecent(product);
  };

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <Card className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={handleView}>
        <CardContent className="p-0 relative aspect-[4/5] overflow-hidden bg-navy-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10 pointer-events-none">
          {product.discount && product.discount > 0 ? (
            <span className="bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">
              {product.discount}% OFF
            </span>
          ) : null}
          {product.badges?.map(badge => (
            <span key={badge} className="bg-navy-900 text-saffron text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-sm">
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-navy-400 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); /* Add to wishlist logic */ }}
        >
          <Heart className="w-4 h-4 transition-transform hover:scale-110" />
        </button>

        {/* Add to cart */}
        <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 ease-out">
          <Button
            size="icon"
            className="rounded-full bg-navy-900 text-white hover:bg-saffron hover:text-navy-900 transition-colors shadow-xl w-12 h-12"
            onClick={handleAddToCart}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-5 bg-white text-navy-900">
        <p className="text-[10px] uppercase tracking-[0.2em] text-navy-400 font-bold mb-1.5">
          {product.category}
        </p>
        <h3 className="font-bold text-lg leading-tight group-hover:text-navy-600 transition-colors line-clamp-1 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2.5">
          <p className="font-extrabold text-navy-900 text-[1.1rem]">
            ₹{product.price.toLocaleString()}
          </p>
          {product.mrp && product.mrp > product.price && (
            <p className="text-sm font-medium text-navy-300 line-through">
              ₹{product.mrp.toLocaleString()}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
    </Link>
  );
}
