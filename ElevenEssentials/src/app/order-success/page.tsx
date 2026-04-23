"use client";

import { CheckCircle2, Package, ArrowRight, ShoppingBag, Sparkles, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { trackPurchase } from "@/lib/pixel";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [orderId] = useState(() => `EE-${Math.floor(Math.random() * 900000) + 100000}`);
  const [checkAnimated, setCheckAnimated] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    trackPurchase(0, "EE-SUCCESS");

    // Staggered entrance: animate check after a brief delay
    const checkTimer = setTimeout(() => setCheckAnimated(true), 300);

    // Redirect Countdown logic
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/my-account/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Confetti burst
    const burstConfetti = () => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: ["#F59E0B", "#0F172A", "#FCD34D", "#1E293B", "#FBBF24"],
        scalar: 1.1,
      });
    };

    // Side streams
    const duration = 3500;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors: ["#F59E0B", "#0F172A"] });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors: ["#F59E0B", "#0F172A"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    setTimeout(burstConfetti, 400);
    setTimeout(frame, 800);

    return () => {
      clearTimeout(checkTimer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-slate-100/80 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden">

          {/* Saffron top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

          <div className="p-10 text-center space-y-8">

            {/* Animated Check Icon */}
            <div className="relative inline-flex items-center justify-center">
              <div
                className={`absolute w-36 h-36 rounded-full bg-amber-100 transition-all duration-700 ease-out ${checkAnimated ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
              />
              <div
                className={`absolute w-28 h-28 rounded-full bg-amber-200/60 transition-all duration-700 delay-100 ease-out ${checkAnimated ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
              />
              <CheckCircle2
                className={`w-20 h-20 relative z-10 text-amber-500 transition-all duration-700 delay-200 ease-out ${checkAnimated ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                strokeWidth={1.5}
              />
              {/* Sparkle badges */}
              <Sparkles
                className={`absolute -top-1 -right-1 w-7 h-7 text-amber-400 transition-all duration-500 delay-500 ${checkAnimated ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-45 scale-0"
                  }`}
              />
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Order Confirmed! 🎉
              </h1>
              <p className="text-slate-400 font-medium text-base leading-relaxed px-4">
                Your premium essentials are being prepared with care and will be dispatched soon.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 text-left divide-y divide-slate-100">

              <div className="flex items-center gap-4 p-5">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">#{orderId}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Delivery</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">3 – 5 Business Days</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                  <p className="text-base font-black text-green-600 mt-0.5">Payment Successful ✓</p>
                </div>
              </div>

            </div>

            {/* Info note */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-2">
                A confirmation has been sent to your registered email. Track your order anytime from your account.
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 py-2 rounded-xl border border-amber-100/50">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                Redirecting to your orders in {countdown}s...
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/shop" className="block">
                <Button
                  className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-base shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Proceed to Shop
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/my-account" className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-slate-900 hover:text-slate-900 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  View My Orders
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mt-6">
          Eleven Essentials · Premium Lifestyle
        </p>

      </div>
    </div>
  );
}
