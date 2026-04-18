"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ProductCard } from '../products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';

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
        <div className="flex gap-2">
           <button className="swiper-prev-btn p-3 rounded-full border border-navy-100 text-navy-900 hover:bg-navy-900 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <button className="swiper-next-btn p-3 rounded-full border border-navy-100 text-navy-900 hover:bg-navy-900 hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-next-btn',
          prevEl: '.swiper-prev-btn',
        }}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-10"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
