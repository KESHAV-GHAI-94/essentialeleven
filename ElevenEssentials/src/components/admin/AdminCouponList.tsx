"use client";

import { useEffect, useState } from "react";
import { CouponService } from "@/services/coupon.service";
import { Plus, Trash2, Ticket, Search, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminCouponList() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: 0,
    maxUses: 100,
    expiresAt: ""
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    CouponService.getAll().then(data => {
      setCoupons(data);
      setLoading(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CouponService.create({
        ...newCoupon,
        expiresAt: newCoupon.expiresAt ? new Date(newCoupon.expiresAt) : null
      });
      setNewCoupon({ code: "", discount: 0, maxUses: 100, expiresAt: "" });
      loadCoupons();
    } catch (e) {
      alert("Failed to create coupon");
    }
  };

  if (loading) return <div>Loading Coupons...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      {/* List Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {coupons.map(coupon => (
              <div key={coupon.id} className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-12 h-12 bg-saffron/5 rounded-bl-[2rem] flex items-center justify-center text-saffron">
                    <Ticket size={20} />
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <p className="text-sm font-black text-navy-400 uppercase tracking-widest leading-none mb-1">Coupon Code</p>
                       <h3 className="text-2xl font-black text-navy-900 font-mono">{coupon.code}</h3>
                    </div>
                    
                    <div className="flex gap-8">
                       <div>
                          <p className="text-[10px] font-black text-navy-400 uppercase">Discount</p>
                          <p className="text-lg font-black text-green-600">{coupon.discount}% OFF</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-navy-400 uppercase">Uses</p>
                          <p className="text-lg font-black text-navy-900">{coupon.usedCount} / {coupon.maxUses || '∞'}</p>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-navy-50 flex items-center justify-between">
                       <p className="text-[10px] font-bold text-navy-400">
                          Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                       </p>
                       <button className="p-2 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Add Form Area */}
      <div className="space-y-6">
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-navy-900 mb-2">Generate Coupon</h2>
            <p className="text-xs text-navy-400 font-bold uppercase tracking-widest mb-8">Boost sales with discounts</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Coupon Code</label>
                   <input 
                     required
                     type="text" 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-black font-mono outline-none focus:ring-1 focus:ring-saffron"
                     placeholder="WELCOME10"
                     value={newCoupon.code}
                     onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Discount Percentage</label>
                   <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
                      <input 
                        required
                        type="number" 
                        className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-black outline-none focus:ring-1 focus:ring-saffron"
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) })}
                      />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Expiry Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
                      <input 
                        type="date" 
                        className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-saffron text-navy-600"
                        value={newCoupon.expiresAt}
                        onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                      />
                   </div>
                </div>
                <Button className="w-full h-12 bg-navy-900 text-white rounded-xl font-bold shadow-xl shadow-navy-100 mt-4 group">
                   <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> Create Coupon
                </Button>
            </form>
         </div>
      </div>
    </div>
  );
}
