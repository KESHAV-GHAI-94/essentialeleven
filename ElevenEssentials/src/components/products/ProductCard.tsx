"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useRecentlyViewed } from "@/store/recently-viewed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const addRecent = useRecentlyViewed((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleView = () => {
    addRecent(product);
  };

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-0 relative aspect-[4/5] overflow-hidden bg-navy-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="icon"
            className="rounded-full bg-saffron text-navy-900 hover:bg-saffron-400"
            onClick={handleAddToCart}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 bg-white text-navy-900">
        <p className="text-xs uppercase tracking-wider text-navy-400 font-semibold mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-lg group-hover:text-navy-600 transition-colors">
          {product.name}
        </h3>
        <p className="font-semibold text-navy-800">
          ₹{product.price.toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  );
}
