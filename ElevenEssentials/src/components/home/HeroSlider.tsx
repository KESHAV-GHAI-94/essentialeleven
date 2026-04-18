"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SLIDES = [
  {
    title: "Essential Timepieces",
    subtitle: "The Obsidian Collection",
    desc: "Engineered for precision. Crafted for the modern nomad.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1600",
    cta: "Explore Watches",
    href: "/shop?cat=obsidian"
  },
  {
    title: "Performance Meridian",
    subtitle: "Tech Staples",
    desc: "Carry your world in our signature woven leather packs.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600",
    cta: "Shop Meridian",
    href: "/shop?cat=meridian"
  }
];

export function HeroSlider() {
  return (
    <section className="h-screen w-full bg-navy-900 group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                className="object-cover opacity-60 scale-105 animate-in zoom-in duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div className="max-w-4xl">
                  <span className="text-saffron text-sm font-bold tracking-[0.4em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-navy-100 text-lg md:text-xl opacity-80 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
                    {slide.desc}
                  </p>
                  <Link 
                    href={slide.href}
                    className="inline-flex items-center gap-2 bg-saffron text-navy-900 px-10 py-4 font-bold rounded shadow-lg hover:bg-white transition-all transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-500"
                  >
                    {slide.cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
