"use client";

import { useEffect, useState } from "react";
import { CustomerService } from "@/services/customer.service";
import { 
  User, 
  Search, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  MoreVertical,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import Image from "next/image";

export function AdminCustomerList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CustomerService.getAllCustomers().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading Customers...</div>;

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
      {/* Customer Toolbar */}
      <div className="p-6 border-b border-navy-50">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..."
              className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-saffron outline-none"
            />
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/50">
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Customer</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Orders</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Location</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Joined</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {customers.map((cust) => (
              <tr key={cust.id} className="hover:bg-navy-50/30 transition-colors group">
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-saffron shrink-0 overflow-hidden relative">
                      {cust.image ? (
                        <Image src={cust.image} alt={cust.name} fill className="object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-navy-900">{cust.name || "Unnamed Customer"}</p>
                      <div className="flex items-center gap-1 text-xs text-navy-400 font-bold">
                        <Mail size={12} className="shrink-0" />
                        <span className="truncate max-w-[150px]">{cust.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-1.5 font-bold text-navy-600">
                      <ShoppingBag size={14} className="text-navy-300" />
                      <span className="text-sm">{cust._count?.orders || 0} Orders</span>
                   </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-xs text-navy-400 font-bold">
                    <MapPin size={12} className="shrink-0" />
                    <span>{cust.addresses?.[0]?.city || "No City"}, {cust.addresses?.[0]?.country || "IN"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-navy-600">{new Date(cust.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </td>
                <td className="p-4 text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all">
                      <ShieldCheck size={18} />
                    </button>
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
