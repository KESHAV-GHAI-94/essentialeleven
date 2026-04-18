"use client";

import { useState, useEffect } from "react";

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const announcements = [
    "✨ Grand Opening: Use code ELEVEN20 for 20% off!",
    "🚚 Free shipping on all orders above ₹1,999",
    "🛡️ Premium Warranty: 2-Year protection on all essentials",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-saffron text-navy-900 border-b border-navy-900/5 overflow-hidden py-3 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] relative z-[60]">
      <div 
        className="animate-in fade-in slide-in-from-right duration-500 ease-in-out"
        key={currentIndex}
      >
        {announcements[currentIndex]}
      </div>
    </div>
  );
}
