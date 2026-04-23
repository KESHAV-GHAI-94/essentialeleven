"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Tag, ShieldCheck, Truck, CreditCard, ChevronRight, Lock, MapPin, User, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { trackInitiateCheckout } from "@/lib/pixel";
import { AddressService } from "@/services/address.service";
import { PaymentService } from "@/services/payment.service";
import { CouponService } from "@/services/coupon.service";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
   const { data: session } = useSession();
   const { items, getCartTotal, clearCart } = useCartStore();
   const [mounted, setMounted] = useState(false);
   const [loading, setLoading] = useState(false);
   const [showExitIntent, setShowExitIntent] = useState(false);
   const [googleLoaded, setGoogleLoaded] = useState(false);
   const [googleError, setGoogleError] = useState<string | null>(null);
   const [predictions, setPredictions] = useState<any[]>([]);
   const hasGoogleKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY.length > 5);
   
   const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
   const [isManualAddress, setIsManualAddress] = useState(!hasGoogleKey);
   const [saveAddress, setSaveAddress] = useState(true);
   const [couponCode, setCouponCode] = useState("");
   const [discount, setDiscount] = useState(0);
   const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
   const [couponError, setCouponError] = useState("");
   const router = useRouter();
   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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
         AddressService.getSavedAddresses(session.user.id).then(setSavedAddresses);
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

   // Fetch place predictions using the modern Google Places (New) API
   const fetchPlacePredictions = async (input: string) => {
      if (!input || input.length < 3 || !googleLoaded) {
         setPredictions([]);
         return;
      }
      try {
         // Google requires AutocompleteSuggestion.fetchAutocompleteSuggestions for new accounts
         const response = await (window as any).google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: input,
            includedRegionCodes: ["in"]
         });
         
         // Google's JS API might return an object with a suggestions array, or just an array directly
         const fetchedSuggestions = response.suggestions || response.predictions || response || [];
         
         if (fetchedSuggestions && fetchedSuggestions.length > 0) {
            setPredictions(fetchedSuggestions);
            setGoogleError(null);
         } else {
            setPredictions([]);
         }
      } catch (err: any) {
         console.error("Google Places Error:", err);
         setPredictions([]);
         
         // Only show the error box if it's a critical configuration failure, not just a transient search error
         if (err.name === 'MapsServerError' || err.message?.includes('NotActivated') || err.message?.includes('API keys')) {
            setGoogleError(`API Error: ${err.message || 'Check Google Cloud Library/Billing'}`);
         } else {
            setGoogleError(null); // Ignore minor errors like no results found
         }
      }
   };

   // Select a place prediction
   const handlePlaceSelect = (place: any) => {
      // Safely extract the most readable text no matter which API structure it used
      const rawText = place.placePrediction?.text?.text || 
                      place.placePrediction?.text || 
                      place.description || 
                      place.formattedAddress || 
                      "Selected Location";
      
      const selectedText = typeof rawText === 'string' ? rawText : String(rawText);
      setFormData({ ...formData, address: selectedText });
      setPredictions([]);
   };

   const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setFormData({ ...formData, address: input });

      if (debounceTimer.current) {
         clearTimeout(debounceTimer.current);
      }

      if (!input || input.length < 3 || !googleLoaded) {
         setPredictions([]);
         return;
      }

      // Set a 1-second delay before calling the Google API to avoid massive rates
      debounceTimer.current = setTimeout(() => {
         fetchPlacePredictions(input);
      }, 1000);
   };


   if (!mounted) return null;
   if (items.length === 0) {
      router.replace("/shop");
      return null;
   }

   const handleApplyCoupon = async () => {
      if (!couponCode.trim()) return;
      try {
         const coupon = await CouponService.validate(couponCode);
         
         // 1. Min Purchase Check
         if (subtotal < coupon.minPurchaseAmount) {
            setCouponError(`Min purchase of ₹${coupon.minPurchaseAmount} required`);
            setAppliedCoupon(null);
            return;
         }

         setAppliedCoupon(coupon);
         setCouponError("");
      } catch (err: any) {
         setAppliedCoupon(null);
         setCouponError(err.response?.data?.error || "Invalid coupon");
      }
   };

   const subtotal = getCartTotal();
   
   // Calculate Base Discount
   let discountAmount = 0;
   if (appliedCoupon) {
      if (appliedCoupon.type === 'PERCENTAGE') {
         discountAmount = subtotal * (appliedCoupon.discount / 100);
         // Apply Max Discount Cap
         if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
            discountAmount = appliedCoupon.maxDiscountAmount;
         }
      } else {
         discountAmount = appliedCoupon.discount;
      }
   }

   // Margin Protection Condition (Standard E-commerce Approach)
   // Ensures coupon doesn't drop the profit below the "Target Margin %" of the Selling Price
   const totalMarginProtection = items.reduce((acc, item) => {
      // Failsafe: If costPrice is missing, treat cost as the full price (0 profit available for discount)
      const cost = item.costPrice ?? item.price;
      const availableProfit = (item.price - (cost || 0));
      const targetProfit = item.price * ((item.markup || 0) / 100);
      const maxItemDiscount = Math.max(0, availableProfit - targetProfit);
      return acc + (maxItemDiscount * item.quantity);
   }, 0);

   let isMarginProtected = false;
   if (totalMarginProtection >= 0) {
      if (discountAmount > totalMarginProtection) {
         discountAmount = totalMarginProtection;
         isMarginProtected = true;
      }
   }

   const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
   const shipping = subtotalAfterDiscount >= 2000 ? 0 : 99;
   const total = subtotalAfterDiscount + shipping;

   const handlePayment = async () => {
      if (!formData.email || !formData.fullName || !formData.phone || !formData.address) {
         alert("Please fill in all required fields.");
         return;
      }

      setLoading(true);
      try {
         // 1. Create order on backend
         const order = await PaymentService.createOrder({
            amount: total,
            userId: session?.user?.id,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            items: items
         });

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
               const verifyData = await PaymentService.verifyPayment(response);

                if (verifyData.success) {
                   // Save address for logged-in users if opted in
                   if (session?.user?.id && saveAddress && formData.address) {
                      try {
                         const saved = await AddressService.addAddress({
                            userId: session.user.id,
                            street: formData.address,
                            city: formData.city,
                            zipCode: formData.pincode,
                            isDefault: savedAddresses.length === 0
                         });
                         // Refresh chip list immediately (dedup handled by backend)
                         if (!saved._duplicate) {
                            setSavedAddresses(prev => [...prev, saved]);
                         }
                      } catch (err) {
                         console.error("Address save failed:", err);
                      }
                   }

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
         <Script src="https://checkout.razorpay.com/v1/checkout.js" />
         {hasGoogleKey && (
            <Script 
               src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&v=weekly`} 
               onLoad={() => setGoogleLoaded(true)}
               onError={() => {
                  setGoogleError("Failed to load Google Maps script (Check network/cors)");
                  setIsManualAddress(true);
               }}
            />
         )}

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
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Phone Number</label>
                        <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-navy-300" />
                              <span className="text-xs font-black text-navy-400 border-r border-navy-100 pr-2">+91</span>
                           </div>
                           <input
                              type="tel"
                              maxLength={10}
                              placeholder="9876543210"
                              className="w-full bg-white border border-navy-100 rounded-xl pl-20 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all shadow-sm"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
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
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-1.5 flex flex-col">
                        <div className="flex justify-between items-center pr-1">
                           <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Street Address</label>
                           {hasGoogleKey && (
                              <button 
                                 onClick={() => setIsManualAddress(!isManualAddress)} 
                                 className="text-[10px] font-bold text-saffron hover:underline"
                              >
                                 {isManualAddress ? "Use Autocomplete" : "Enter Manually"}
                              </button>
                           )}
                        </div>
                        <div className="relative z-20">
                           <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 z-10" />
                              <div className="w-full bg-white border border-navy-100 rounded-xl focus-within:ring-2 focus-within:ring-saffron transition-all shadow-sm">
                                 {isManualAddress ? (
                                    <input
                                       type="text"
                                       placeholder="Enter your street/building manually..."
                                       className="w-full h-12 pl-11 pr-4 bg-transparent outline-none text-sm font-semibold text-navy-900"
                                       value={formData.address}
                                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                       required
                                    />
                                 ) : (
                                    <div className="relative">
                                       <input
                                          type="text"
                                          placeholder={googleError ? "Google API Error. Use Manual." : "Search for your street/building..."}
                                          className="w-full h-12 pl-11 pr-4 bg-transparent outline-none text-sm font-semibold text-navy-900"
                                          value={formData.address}
                                          onChange={handleAddressInputChange}
                                          required
                                       />
                                       
                                       {predictions.length > 0 && (
                                          <div className="absolute top-12 left-0 w-full bg-white border border-navy-100 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto mt-1">
                                             {predictions.map((p, idx) => {
                                                const mainTitle = p.placePrediction?.mainText?.text || p.placePrediction?.text?.text || p.description || "Location";
                                                const subTitle = p.placePrediction?.secondaryText?.text || p.structured_formatting?.secondary_text || "";
                                                return (
                                                   <div 
                                                      key={p.placePrediction?.placeId || p.place_id || idx} 
                                                      className="px-4 py-3 hover:bg-navy-50 cursor-pointer border-b border-navy-50 last:border-b-0"
                                                      onClick={() => handlePlaceSelect(p)}
                                                   >
                                                      <p className="text-sm font-bold text-navy-900 truncate">{mainTitle}</p>
                                                      {subTitle && <p className="text-xs font-medium text-navy-400 truncate mt-0.5">{subTitle}</p>}
                                                   </div>
                                                )
                                             })}
                                          </div>
                                       )}
                                       {googleError && (
                                          <div className="absolute top-12 left-0 w-full bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-xs font-bold text-center z-50">
                                             Google Places API Rejected: <span className="font-black">{googleError}</span><br/>
                                             Usually means Places API isn't enabled or Billing is missing in Google Cloud. Click "Enter Manually".
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           </div>
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
                              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                           />
                        </div>
                        <div className="space-y-1.5 flex flex-col col-span-2 sm:col-span-1">
                           <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">City / Town</label>
                           <input
                              type="text"
                              placeholder="City"
                              className="w-full bg-white border border-navy-100 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-saffron outline-none transition-all shadow-sm"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                           />
                        </div>
                     </div>

                   {/* Save Address Toggle — only for logged-in users */}
                   {session?.user?.id && (
                      <label className="flex items-center gap-3 cursor-pointer select-none group mt-1">
                         <div
                            onClick={() => setSaveAddress(!saveAddress)}
                            className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                               saveAddress ? "bg-navy-900" : "bg-navy-200"
                            }`}
                         >
                            <span
                               className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                  saveAddress ? "translate-x-5" : "translate-x-0"
                               }`}
                            />
                         </div>
                         <span className="text-xs font-bold text-navy-500 group-hover:text-navy-800 transition-colors">
                            Save this address for future orders
                         </span>
                      </label>
                   )}
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

                     {/* Coupon Options */}
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Promo Code</label>
                        <div className="flex gap-2">
                           <input
                              type="text"
                              placeholder="Enter Code"
                              className="w-full bg-white border border-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-saffron outline-none transition-all shadow-sm uppercase placeholder:normal-case"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              disabled={!!appliedCoupon}
                           />
                           {appliedCoupon ? (
                              <Button variant="outline" className="h-11 px-6 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl" onClick={() => { setAppliedCoupon(null); setCouponCode(""); setCouponError(""); }}>Remove</Button>
                           ) : (
                              <Button className="h-11 px-6 bg-navy-900 text-white hover:bg-black rounded-xl" onClick={handleApplyCoupon}>Apply</Button>
                           )}
                        </div>
                        {appliedCoupon && (
                           <p className="text-xs text-green-600 font-bold pl-1">
                              ✓ Coupon <span className="uppercase">{appliedCoupon.code}</span> applied!
                           </p>
                        )}
                        {couponError && <p className="text-xs text-red-500 font-bold pl-1">{couponError}</p>}
                     </div>

                     <div className="h-px bg-navy-50" />

                     {/* Calculations */}
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold text-navy-400 uppercase tracking-widest">
                           <span>Subtotal</span>
                           <span className="text-navy-900 font-black">₹{subtotal.toLocaleString()}</span>
                        </div>
                        {appliedCoupon && discountAmount > 0 && (
                           <div className="space-y-1">
                              <div className="flex justify-between text-sm font-bold text-green-600 uppercase tracking-widest">
                                 <span>
                                    Promo{" "}
                                    {!isMarginProtected && (
                                       appliedCoupon.type === "PERCENTAGE"
                                         ? `(${appliedCoupon.discount}% OFF)`
                                         : `(₹${appliedCoupon.discount} OFF)`
                                    )}
                                 </span>
                                 <span className="font-black">-₹{discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                              {isMarginProtected && (
                                 <p className="text-[9px] text-indigo-500 font-bold italic text-right">
                                    ✨ Exclusive Safety Floor Applied
                                 </p>
                              )}
                           </div>
                        )}
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
                           <p className="text-3xl font-black">₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
                        <Tag className="w-10 h-10 text-saffron" />
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
