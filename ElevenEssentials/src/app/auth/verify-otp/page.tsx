"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") || "+91 **********";

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/shop");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-navy-900" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Verify Phone</h1>
          <p className="text-navy-400 text-sm">
            Enter the 6-digit code sent to <br />
            <span className="font-bold text-navy-900">{phone}</span>
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-10">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-navy-50 border-2 border-transparent focus:border-saffron rounded-xl focus:ring-0 transition-all outline-none"
            />
          ))}
        </div>

        <Button 
          className="w-full bg-navy-900 text-white hover:bg-navy-800 h-14 rounded-xl font-bold text-lg group"
          onClick={handleVerify}
          disabled={loading || otp.some(d => !d)}
        >
          {loading ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <>Verify & Access <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
          )}
        </Button>

        <p className="text-center mt-8 text-sm text-navy-400">
          Didn&apos;t receive any code? <br />
          <button className="text-navy-900 font-bold hover:underline mt-1">Resend in 0:59</button>
        </p>
      </div>
    </div>
  );
}
