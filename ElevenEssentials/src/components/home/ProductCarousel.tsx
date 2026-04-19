"use client";

import { ProductCard } from '../products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  title: string;
  products: any[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-navy-900 tracking-tight">{title}</h2>
          <div className="w-12 h-1 bg-saffron mt-2" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        {products.map((product) => (
          <div key={product.id} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2.5rem)] max-w-[380px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
