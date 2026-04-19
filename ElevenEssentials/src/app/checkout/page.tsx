"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, CreditCard, ChevronRight, Lock, MapPin, User, Mail, Phone, ShoppingTag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { trackInitiateCheckout } from "@/lib/pixel";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google) {
      setGoogleLoaded(true);
    }
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [showExitIntent]);

  useEffect(() => {
    setMounted(true);
    if (items.length > 0) {
      trackInitiateCheckout(getCartTotal(), items.length);
    }
    if (session?.user?.id) {
       fetch(`http://localhost:4000/api/addresses/user/${session.user.id}`)
         .then(res => res.json())
         .then(data => {
            setSavedAddresses(data);
            const def = data.find((a: any) => a.isDefault);
            if (def) handleSelectAddress(def);
         });
    }
  }, [session?.user?.id]);

  const [formData, setFormData] = useState({
    email: session?.user?.email || "",
    phone: "",
    fullName: session?.user?.name || "",
    address: "",
    pincode: "",
    city: ""
  });

  const handleSelectAddress = (address: any) => {
    setFormData({
       ...formData,
       address: address.street,
       city: address.city,
       pincode: address.zipCode
    });
  };

  const handleAddressSelect = (place: any) => {
    // Extracting details from Google Place object would go here
    setFormData({...formData, address: place.label});
  };



  if (!mounted) return null;
  if (items.length === 0) {
    router.replace("/shop");
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    if (!formData.email || !formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await fetch("http://localhost:4000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          userId: session?.user?.id,
          email: formData.email,
          items: items,
          receipt: `receipt_${Date.now()}`
        })
      });
      const order = await res.json();

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Eleven Essentials",
        description: "Premium Lifestyle Essentials",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment
          const verifyRes = await fetch("http://localhost:4000/api/payments/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            clearCart();
            router.push("/order-success");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#0F172A"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`} 
        strategy="lazyOnload"
        onLoad={() => setGoogleLoaded(true)}
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Mini Header */}
      <div className="bg-white border-b border-navy-100 py-6 px-4 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-navy-900 flex items-center justify-center font-bold text-saffron group-hover:rotate-6 transition-transform">
                E11
              </div>
              <span className="text-lg font-black text-navy-900 tracking-tighter">
                ESSENTIAL <span className="text-saffron">ELEVEN</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-400 uppercase tracking-widest">
               <Lock className="w-3.5 h-3.5" /> Secure 256-bit SSL Checkout
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column: Form Sections */}
        <div className="space-y-12">
           
           {/* Section 1: Contact Info */}
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-navy-900 text-saffron flex items-center justify-center font-black text-lg shadow-lg">1</div>
                 <h2 className="text-2xl font-black text-navy-900">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                       <input 
                         type="email" 
                         placeholder="you@example.com" 
                         className="w-full bg-white border border-navy-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all shadow-sm"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                       <input 
                         type="tel" 
                         placeholder="+91 XXXX XXX XXX" 
                         className="w-full bg-white border border-navy-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all shadow-sm" 
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 2: Shipping Address */}
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-navy-900 text-saffron flex items-center justify-center font-black text-lg shadow-lg">2</div>
                 <h2 className="text-2xl font-black text-navy-900">Shipping Details</h2>
              </div>
              
              {/* Saved Addresses Chip List */}
              {savedAddresses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                   {savedAddresses.map(addr => (
                      <button 
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className="px-4 py-2 bg-white border border-navy-100 rounded-full text-xs font-bold text-navy-600 hover:border-saffron hover:text-saffron transition-all"
                      >
                         {addr.street}, {addr.city} {addr.isDefault && "⭐"}
                      </button>
                   ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                       <input 
                         type="text" 
                         placeholder="Enter your full name" 
                         className="w-full bg-white border border-navy-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron outline-none transition-all shadow-sm" 
                         value={formData.fullName}
                         onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Street Address</label>
                    <div className="relative z-20">
                       {googleLoaded ? (
                         <GooglePlacesAutocomplete
                           apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
                           selectProps={{
                              value: { label: formData.address, value: formData.address },
                              onChange: handleAddressSelect,
                              placeholder: "Flat / House No. / Building / Street",
                              className: "checkout-autocomplete",
                           }}
                         />
                       ) : (
                         <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                            <input 
                              type="text" 
                              placeholder="Flat / House No. / Building / Street" 
                              className="w-full bg-white border border-navy-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron outline-none transition-all shadow-sm" 
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col col-span-2 sm:col-span-1">
                       <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Pincode</label>
                       <input 
                         type="text" 
                         placeholder="6 Digit PIN" 
                         className="w-full bg-white border border-navy-100 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron outline-none transition-all shadow-sm" 
                         value={formData.pincode}
                         onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5 flex flex-col col-span-2 sm:col-span-1">
                       <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">City / Town</label>
                       <input 
                         type="text" 
                         placeholder="City" 
                         className="w-full bg-white border border-navy-100 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron outline-none transition-all shadow-sm" 
                         value={formData.city}
                         onChange={(e) => setFormData({...formData, city: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Payment */}
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-navy-900 text-saffron flex items-center justify-center font-black text-lg shadow-lg">3</div>
                 <h2 className="text-2xl font-black text-navy-900">Payment Selection</h2>
              </div>
              <div className="space-y-3">
                 <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-saffron bg-saffron/5 cursor-pointer shadow-sm">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-navy-900" />
                    <div className="flex-1">
                       <p className="font-bold text-navy-900">Online Payment (UPI, Cards, Netbanking)</p>
                       <p className="text-xs text-navy-400 font-medium">Safe & Secure via Razorpay</p>
                    </div>
                    <CreditCard className="w-6 h-6 text-navy-900" />
                 </label>
                 <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-navy-50 bg-white hover:border-navy-200 transition-all cursor-pointer shadow-sm opacity-60">
                    <input type="radio" name="payment" className="w-5 h-5 accent-navy-900" />
                    <div className="flex-1">
                       <p className="font-bold text-navy-900">Cash on Delivery (COD)</p>
                       <p className="text-xs text-navy-400 font-medium">+₹49 Handling Fee</p>
                    </div>
                    <Truck className="w-6 h-6 text-navy-400" />
                 </label>
              </div>
           </div>

           <Button 
             className="w-full h-16 bg-navy-900 hover:bg-black text-white rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-[1.01] active:scale-95 flex gap-3 group"
             onClick={handlePayment}
             disabled={loading}
           >
              {loading ? "Initializing..." : "Complete Payment"} <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
           </Button>
        </div>

        {/* Right Column: Order Summary UI */}
        <div className="lg:sticky lg:top-28 h-fit">
           <div className="bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden">
              <div className="p-8 bg-navy-50/50 border-b border-navy-50">
                 <h3 className="text-xl font-black text-navy-900">Order Summary</h3>
              </div>
              
              <div className="p-8 space-y-6">
                 {/* Item List */}
                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {items.map((item) => (
                       <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-navy-100 shrink-0">
                             {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 py-1">
                             <div className="flex justify-between items-start">
                                <p className="text-sm font-bold text-navy-900 line-clamp-1">{item.name}</p>
                                <p className="text-sm font-black text-navy-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                             </div>
                             <p className="text-xs text-navy-400 font-medium mt-1">QTY: {item.quantity}</p>
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="h-px bg-navy-50" />

                 {/* Calculations */}
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-navy-400 uppercase tracking-widest">
                       <span>Subtotal</span>
                       <span className="text-navy-900 font-black">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-navy-400 uppercase tracking-widest">
                       <span>Estimated Shipping</span>
                       <span className={shipping === 0 ? "text-green-600 font-black" : "text-navy-900 font-black"}>
                          {shipping === 0 ? "FREE" : `₹${shipping}`}
                       </span>
                    </div>
                 </div>

                 <div className="p-6 bg-navy-900 rounded-2xl text-white flex justify-between items-end shadow-lg">
                    <div>
                       <p className="text-[10px] font-black text-saffron uppercase tracking-widest mb-1">Final Amount</p>
                       <p className="text-3xl font-black">₹{total.toLocaleString()}</p>
                    </div>
                    <ShieldCheck className="w-10 h-10 text-saffron/30" />
                 </div>

                 <div className="flex items-center gap-2 justify-center text-[11px] font-bold text-navy-300 uppercase tracking-wider py-4">
                    <Lock className="w-3.5 h-3.5" /> All Transactions are 100% Encrypted
                 </div>
              </div>
           </div>
        </div>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-saffron" />
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-6 right-6 text-navy-200 hover:text-navy-900 transition-colors font-bold text-xl"
              >✕</button>
              
              <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShoppingTag className="w-10 h-10 text-saffron" />
              </div>
              
              <h2 className="text-3xl font-black text-navy-900 mb-2">Wait! Don't leave yet</h2>
              <p className="text-navy-400 font-medium mb-8">
                 Complete your order in the next <span className="text-navy-900 font-bold">10 minutes</span> and get an extra 10% OFF your entire purchase!
              </p>
              
              <div className="bg-navy-50 rounded-2xl p-6 border-2 border-dashed border-navy-200 mb-8">
                 <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest mb-2">Use Promo Code At Checkout</p>
                 <p className="text-4xl font-black text-navy-900 tracking-tighter">ESSENTIAL10</p>
              </div>

              <Button 
                className="w-full h-16 bg-navy-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl"
                onClick={() => setShowExitIntent(false)}
              >
                 I'll take it!
              </Button>
           </div>
        </div>
      )}
    </div>
    </>
  );
}
