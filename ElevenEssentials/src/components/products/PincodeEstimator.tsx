"use client";

import { useState } from "react";
import { MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShippingService } from "@/services/shipping.service";

export function PincodeEstimator() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deliveryDate, setDeliveryDate] = useState("");

  const handleCheck = async () => {
    if (pincode.length !== 6) return;
    setStatus("loading");
    
    try {
      const data = await ShippingService.getEstimates(pincode);
      
      if (data.status === "success") {
        setDeliveryDate(data.deliveryDate);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch(err) {
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 border border-navy-100 rounded-2xl p-5 bg-white">
      <div className="flex items-center gap-2 mb-3">
         <Truck className="w-5 h-5 text-navy-400" />
         <h3 className="font-bold text-navy-900 text-sm uppercase">Delivery Options</h3>
      </div>
      
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
          <input 
            type="text" 
            maxLength={6}
            placeholder="Enter Pincode"
            className="w-full bg-navy-50 border-none rounded-xl pl-9 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-saffron focus:bg-white transition-all outline-none"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
        </div>
        <Button 
          variant="outline" 
          className="rounded-xl font-bold bg-white border-navy-200 text-navy-600 hover:bg-navy-50 hover:text-navy-900 px-6"
          onClick={handleCheck}
          disabled={status === "loading" || pincode.length !== 6}
        >
          {status === "loading" ? "..." : "Check"}
        </Button>
      </div>

      {status === "success" && (
        <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl text-green-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-900">Delivery available!</p>
            <p>Get it by <span className="font-extrabold">{deliveryDate}</span></p>
            <p className="text-xs mt-1 text-green-700 opacity-80">Cash on Delivery (COD) available.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Delivery unavailable</p>
            <p className="text-xs mt-1">We currently do not ship to this pincode.</p>
          </div>
        </div>
      )}
    </div>
  );
}
