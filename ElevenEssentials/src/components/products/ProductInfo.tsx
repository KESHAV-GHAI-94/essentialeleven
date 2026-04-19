"use client";

import { useState } from "react";
import { Minus, Plus, Heart, Share2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { trackAddToCart } from "@/lib/pixel";
import { PincodeEstimator } from "./PincodeEstimator";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: any;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    variants: ProductVariant[];
    mrp: number; // For demo discounts
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const mrp = product.mrp || (selectedVariant.price * 1.25); // Simulated MRP
  const discount = Math.round(((mrp - selectedVariant.price) / mrp) * 100);
  const savings = mrp - selectedVariant.price;

  const handleAddToCart = () => {
    if (selectedVariant.stock < quantity) {
      alert("Not enough stock available.");
      return;
    }
    const item = {
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      name: `${product.name} - ${selectedVariant.name}`,
      price: selectedVariant.price,
      image: product.images[0] || "/images/hero/obsidian.jpg",
      quantity,
      attributes: selectedVariant.attributes
    };
    addItem(item);
    trackAddToCart(item);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Title & Badges */}
      <div>
        <p className="text-navy-400 font-bold tracking-widest text-xs uppercase mb-2">{product.category}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-navy-900 leading-tight mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 text-sm font-semibold text-navy-600">
          <span className="flex items-center gap-1 text-green-600"><ShieldCheck className="w-4 h-4"/> 1 Year Warranty</span>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="p-5 bg-navy-50 rounded-2xl border border-navy-100">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-black text-navy-900">₹{selectedVariant.price.toLocaleString()}</span>
          {mrp > selectedVariant.price && (
            <span className="text-xl text-navy-300 font-medium line-through mb-1">₹{mrp.toLocaleString()}</span>
          )}
        </div>
        {discount > 0 && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 font-bold text-xs rounded uppercase tracking-wider">You save {discount}%</span>
            <span className="text-navy-400 text-sm font-semibold">(₹{savings.toLocaleString()})</span>
          </div>
        )}
        <p className="text-xs text-navy-300 mt-3 font-medium">Inclusive of all taxes</p>
      </div>

      {/* Variants Selection */}
      {product.variants.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-navy-900 uppercase">Select Variant</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <Button
                key={v.id}
                variant={selectedVariant.id === v.id ? "default" : "outline"}
                className={`transition-all rounded-lg font-semibold ${selectedVariant.id === v.id ? 'bg-navy-900 text-white shadow-md' : 'text-navy-600 border-navy-200 hover:border-navy-900'}`}
                onClick={() => setSelectedVariant(v)}
              >
                {v.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Action Area */}
      <div className="flex flex-col gap-4 mt-4">
        {selectedVariant.stock > 0 ? (
          <div className="flex gap-4 items-center">
            {/* Quantity Selector */}
            <div className="flex items-center border-2 border-navy-100 rounded-xl max-w-fit overflow-hidden bg-white">
              <Button variant="ghost" className="rounded-none hover:bg-navy-50 text-navy-600 px-4 h-14" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="w-5 h-5" />
              </Button>
              <span className="w-12 text-center font-bold text-lg text-navy-900 select-none pb-1">{quantity}</span>
              <Button variant="ghost" className="rounded-none hover:bg-navy-50 text-navy-600 px-4 h-14" onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Add to Cart */}
            <Button size="lg" className="flex-1 h-14 text-lg font-bold bg-saffron hover:bg-saffron-400 text-navy-900 rounded-xl hover:shadow-lg transition-all" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="text-red-500 font-bold bg-red-50 p-4 rounded-xl text-center">Currently Out of Stock</span>
            {/* Notify Me block */}
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email to get notified" className="flex-1 border-2 border-navy-100 rounded-xl px-4 py-3 focus:outline-none focus:border-saffron font-medium"/>
              <Button size="lg" className="h-14 font-bold bg-navy-900 rounded-xl">Notify Me</Button>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-2">
           <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold text-navy-600 shadow-sm border-navy-100 gap-2 hover:bg-navy-50">
             <Heart className="w-5 h-5" /> Wishlist
           </Button>
           <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold text-navy-600 shadow-sm border-navy-100 gap-2 hover:bg-navy-50">
             <Share2 className="w-5 h-5" /> Share
           </Button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 border-t border-navy-100 pt-8">
        <h3 className="text-xl font-bold text-navy-900 mb-4">Product Description</h3>
        <p className="text-navy-600 leading-relaxed max-w-prose whitespace-pre-line">
          {product.description}
        </p>
      </div>

      <PincodeEstimator />
      
    </div>
  );
}
