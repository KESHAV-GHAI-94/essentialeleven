"use client";

import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { trackPurchase } from "@/lib/pixel";

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackPurchase(0, "EE-SUCCESS"); // In production we'd pass actual total
    // Trigger confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F59E0B', '#0F172A']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F59E0B', '#0F172A']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-saffron/20 rounded-full blur-2xl animate-pulse" />
          <CheckCircle2 className="w-24 h-24 text-saffron relative z-10 mx-auto" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-navy-900 tracking-tight">Order Placed!</h1>
          <p className="text-navy-400 font-medium px-6">
            Thank you for your purchase. Your premium essentials are being prepared for dispatch.
          </p>
        </div>

        <div className="bg-navy-50/50 rounded-3xl p-6 border border-navy-50 text-left space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center">
                 <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-400 uppercase tracking-widest">Order ID</p>
                <p className="text-sm font-black text-navy-900">#EE-{Math.floor(Math.random() * 900000) + 100000}</p>
              </div>
           </div>
           <p className="text-xs text-navy-400 font-medium leading-relaxed">
             A confirmation email has been sent to your inbox. You can track your order status in your account dashboard.
           </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/shop">
            <Button className="w-full h-14 bg-navy-900 hover:bg-black text-white rounded-2xl font-bold text-lg flex gap-2">
              <ShoppingBag className="w-5 h-5" /> Back to Shop
            </Button>
          </Link>
          <Link href="/my-account/orders">
            <Button variant="outline" className="w-full h-14 border-navy-100 text-navy-600 font-bold rounded-2xl flex gap-2">
              View Order Status <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-navy-200 font-bold uppercase tracking-[0.2em]">
           Premium Essentials for the Modern Individual
        </p>

      </div>
    </div>
  );
}
