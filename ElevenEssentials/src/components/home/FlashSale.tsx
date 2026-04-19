"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { ProductCard } from "../products/ProductCard";

interface FlashSaleProps {
  products: any[];
}

export function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="bg-navy-900 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-saffron text-navy-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <Zap className="w-3 h-3 animate-pulse" /> Live Now
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">Meridian Flash Sale</h2>
                </div>

                {/* Timer */}
                <div className="flex gap-4">
                    {[
                        { label: 'Hours', val: timeLeft.hours },
                        { label: 'Min', val: timeLeft.minutes },
                        { label: 'Sec', val: timeLeft.seconds },
                    ].map(unit => (
                        <div key={unit.label} className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-navy-800 rounded-lg flex items-center justify-center text-2xl font-bold text-saffron border border-white/5">
                                {format(unit.val)}
                            </div>
                            <span className="text-[10px] text-navy-400 uppercase tracking-widest mt-2">{unit.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-10">
                {products.slice(0, 4).map(product => (
                    <div key={product.id} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2.5rem)] max-w-[380px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}
