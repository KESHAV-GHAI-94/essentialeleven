"use client";

import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FlashSale } from "@/components/home/FlashSale";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Star, Shield, Zap } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/products");
        const productsRaw = await response.json();
        
        if (Array.isArray(productsRaw)) {
          const mapped = productsRaw.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.variants?.[0]?.price || 0,
            image: p.images?.[0] || "",
            category: p.category?.name || "Essentials",
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center gap-4 text-saffron">
       <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
       <p className="font-bold tracking-widest uppercase text-xs">Initializing E11 Experience...</p>
    </div>
  );

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(0, 6);

  const features = [
    { icon: Star, title: "Curated Precision", desc: "We don't sell everything. We sell the eleven things you actually need." },
    { icon: Shield, title: "Zero Budget Privacy", desc: "Your data is yours. We use open-source tech to keep the platform free and clean." },
    { icon: Zap, title: "Meridian Delivery", desc: "Proprietary logistics ensuring your essentials reach you before high noon." },
  ];

  return (
    <div className="flex flex-col">
      <HeroSlider />
      
      <CategoryGrid />

      {featured.length > 0 && <FlashSale products={featured} />}

      {newArrivals.length > 0 && <ProductCarousel title="New Arrivals" products={newArrivals} />}

      {featured.length > 0 && <ProductCarousel title="Trending Essentials" products={featured} />}

      {/* Why Essential Eleven */}
      <section className="py-24 bg-navy-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
           <h2 className="text-4xl font-bold text-navy-900 mb-4 tracking-tight">The E11 Standard</h2>
           <div className="w-16 h-1 bg-saffron mx-auto" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col items-start bg-white p-10 rounded-lg shadow-sm border border-navy-100/50 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-navy-900 rounded flex items-center justify-center mb-6">
                    {Icon && <Icon className="w-6 h-6 text-saffron" />}
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-navy-600 leading-relaxed opacity-80">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
