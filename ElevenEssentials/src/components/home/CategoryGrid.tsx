"use client";

import { Watch, Laptop, Package, Sparkles, Shirt, Smartphone, Camera, Headphones } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Timepieces", icon: Watch, count: 12, color: "bg-blue-50" },
  { name: "Computing", icon: Laptop, count: 8, color: "bg-orange-50" },
  { name: "Carry-ons", icon: Package, count: 15, color: "bg-green-50" },
  { name: "Accessories", icon: Sparkles, count: 24, color: "bg-purple-50" },
  { name: "Apparel", icon: Shirt, count: 32, color: "bg-pink-50" },
  { name: "Mobile", icon: Smartphone, count: 11, color: "bg-cyan-50" },
  { name: "Optics", icon: Camera, count: 6, color: "bg-amber-50" },
  { name: "Audio", icon: Headphones, count: 9, color: "bg-indigo-50" },
];

export function CategoryGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-navy-900 mb-4 tracking-tight">Browse by Collection</h2>
        <p className="text-navy-400">Hand-picked categories for the sophisticated catalog.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/shop?cat=${cat.name.toLowerCase()}`}
            className={`group p-10 ${cat.color} rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-navy-900 group-hover:text-white transition-all">
                <cat.icon className="w-8 h-8 text-navy-900 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-navy-900 mb-1">{cat.name}</h3>
            <p className="text-xs text-navy-400 font-medium uppercase tracking-wider">{cat.count} Variants</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
