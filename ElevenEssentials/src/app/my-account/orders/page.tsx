"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight, Search, Filter, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
}

import { PaymentService } from "@/services/payment.service";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
       PaymentService.getUserOrders(session.user.id)
         .then((res: any) => {
            setOrders(res || []);
         })
         .catch(err => console.error("Failed to fetch orders:", err))
         .finally(() => setLoading(false));
    } else if (session === null) {
       setLoading(false); // Not logged in
    }
  }, [session]);

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-navy-50/20">
          <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
           <h1 className="text-3xl font-black text-navy-900 tracking-tight">My Orders</h1>
           <p className="text-navy-400 font-medium">Manage and track your recent purchases</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
              <input type="text" placeholder="Search orders..." className="bg-white border border-navy-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-saffron outline-none" />
           </div>
           <Button variant="outline" className="rounded-xl border-navy-100 flex gap-2 font-bold text-navy-600">
              <Filter className="w-4 h-4" /> Filters
           </Button>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-navy-50 shadow-sm">
             <ShoppingBag className="w-16 h-16 text-navy-100 mx-auto mb-6" />
             <h2 className="text-xl font-bold text-navy-900 mb-2">No orders found</h2>
             <p className="text-navy-400 mb-8 max-w-xs mx-auto">You haven't placed any orders yet. Explore our essentials and start shopping!</p>
             <Link href="/shop">
                <Button className="bg-navy-900 text-white font-bold rounded-xl px-10 h-14">Go to Shop</Button>
             </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
               
               {/* Order Header */}
               <div className="bg-navy-50/50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-navy-50">
                  <div className="flex items-center gap-6">
                     <div>
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-0.5">Order Placed</p>
                        <p className="font-bold text-navy-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-0.5">Total</p>
                        <p className="font-bold text-navy-900">₹{order.total.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-0.5">Order Id</p>
                        <p className="font-bold text-navy-900">{order.id}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="px-4 py-1.5 bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest rounded-full border border-saffron/20">
                        {order.status}
                     </span>
                     <Link href={`/my-account/orders/${order.id}`}>
                        <Button variant="ghost" className="text-navy-400 hover:text-navy-900 p-2">
                           View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                     </Link>
                  </div>
               </div>

               {/* Order Items */}
               <div className="p-6">
                  {order.items.map((item, idx) => (
                     <div key={item.id} className={`flex items-center gap-6 ${idx !== 0 ? 'mt-6 pt-6 border-t border-navy-50' : ''}`}>
                        <div className="relative w-20 h-24 bg-navy-50 rounded-xl overflow-hidden shrink-0 border border-navy-100">
                           {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                        </div>
                        <div className="flex-1">
                           <h4 className="font-black text-navy-900 text-lg mb-1">{item.name}</h4>
                           <p className="text-sm font-bold text-navy-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right space-y-2">
                           <Button variant="outline" className="rounded-xl border-navy-100 font-bold hover:bg-navy-50 text-xs">Buy it again</Button>
                           <p className="text-sm font-black text-navy-900">₹{item.price.toLocaleString()}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Tracking Indicator Placeholder */}
               <div className="p-6 bg-navy-50/30 border-t border-navy-50">
                  <div className="flex items-center gap-3 text-green-600">
                     <Package className="w-4 h-4" />
                     <p className="text-xs font-bold uppercase tracking-wider">Estimated delivery: {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}</p>
                  </div>
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
