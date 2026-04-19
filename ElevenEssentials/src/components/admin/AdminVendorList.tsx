"use client";

import { useEffect, useState } from "react";
import { VendorService } from "@/services/vendor.service";
import { 
  Store, 
  Search, 
  MapPin, 
  ShoppingBag, 
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Plus
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AdminVendorList() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    VendorService.getAll().then(data => {
      setVendors(data);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await VendorService.updateStatus(id, !current);
      setVendors(vendors.map(v => v.id === id ? { ...v, isActive: !current } : v));
    } catch (e) {
      alert("Failed to update vendor status");
    }
  };

  if (loading) return <div>Loading Vendors...</div>;

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden text-left">
      <div className="p-6 border-b border-navy-50 flex items-center justify-between">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by brand name..."
              className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-saffron outline-none"
            />
          </div>
          <Button className="bg-navy-900 text-white rounded-xl px-6 h-12 font-black flex items-center gap-2">
            <Plus size={18} /> Approve New Vendor
          </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/50">
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Brand / Vendor</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Products</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Joined</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-navy-50/30 transition-colors group">
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center text-saffron shrink-0 overflow-hidden relative">
                      {vendor.logo ? (
                        <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" />
                      ) : (
                        <Store size={24} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-navy-900 uppercase tracking-tight">{vendor.name}</p>
                      <p className="text-xs text-navy-400 font-bold truncate max-w-[200px]">{vendor.description || "Premium Merchant Partner"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-1.5 font-bold text-navy-600">
                      <ShoppingBag size={14} className="text-navy-300" />
                      <span className="text-sm">{vendor._count?.products || 0} Listed</span>
                   </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-navy-600">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleStatus(vendor.id, vendor.isActive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    vendor.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}>
                    {vendor.isActive ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {vendor.isActive ? "ACTIVE" : "BLOCKED"}
                  </button>
                </td>
                <td className="p-4 text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
