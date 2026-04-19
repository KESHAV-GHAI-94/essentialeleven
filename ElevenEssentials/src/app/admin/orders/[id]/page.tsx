"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Printer,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    OrderService.getOrderById(id as string).then(data => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await OrderService.updateOrderStatus(id as string, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (error) {
       alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8">Loading Order Detail...</div>;
  if (!order) return <div className="p-8 text-center"><p className="text-xl font-bold">Order not found</p><Link href="/admin/orders" className="text-saffron mt-4 inline-block">Back to orders</Link></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button onClick={() => router.back()} className="p-2 hover:bg-navy-50 rounded-xl text-navy-400 transition-colors">
              <ChevronLeft size={24} />
           </button>
           <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-navy-900 tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-saffron/10 text-saffron'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-navy-400 font-medium">Placed on {new Date(order.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-navy-100 text-navy-600 rounded-xl px-4 flex gap-2">
              <Printer size={18} /> Print Invoice
           </Button>
           <select 
             className="bg-navy-900 text-white rounded-xl px-4 h-10 text-sm font-bold outline-none cursor-pointer disabled:opacity-50"
             value={order.status}
             disabled={updating}
             onChange={(e) => handleStatusChange(e.target.value)}
           >
              <option value="PENDING">Mark as Pending</option>
              <option value="PROCESSING">Mark as Processing</option>
              <option value="SHIPPED">Mark as Shipped</option>
              <option value="DELIVERED">Mark as Delivered</option>
              <option value="CANCELLED">Mark as Cancelled</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Items & Payment */}
        <div className="lg:col-span-2 space-y-8">
           {/* Items List */}
           <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-navy-50 flex items-center justify-between">
                 <h2 className="text-xl font-black text-navy-900 flex items-center gap-2">
                    <Package className="text-saffron" size={20} /> Order Items
                 </h2>
                 <span className="text-xs font-bold text-navy-400 uppercase tracking-widest">{order.items.length} Items</span>
              </div>
              <div className="divide-y divide-navy-50">
                 {order.items.map((item: any) => (
                   <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-navy-50/20 transition-colors">
                      <div className="w-16 h-16 bg-navy-50 rounded-2xl relative overflow-hidden shrink-0 border border-navy-100/50">
                         {item.variant?.product?.images?.[0] ? (
                            <Image src={item.variant.product.images[0]} alt={item.variant.product.name} fill className="object-cover" />
                         ) : (
                            <div className="flex items-center justify-center h-full"><Package className="text-navy-100" /></div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="font-bold text-navy-900 group-hover:text-saffron transition-colors truncate">{item.variant?.product?.name}</p>
                         <p className="text-xs text-navy-400 font-bold uppercase tracking-tight mt-0.5">Variant: {item.variant?.name || 'Default'} • Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-navy-900">₹{item.variant?.price.toLocaleString()}</p>
                         <p className="text-xs text-navy-400 font-bold uppercase">Subtotal: ₹{(item.variant?.price * item.quantity).toLocaleString()}</p>
                      </div>
                   </div>
                 ))}
              </div>
              {/* Summary Footer */}
              <div className="bg-navy-50/50 p-6 border-t border-navy-50 space-y-2">
                 <div className="flex justify-between text-sm font-bold text-navy-400">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-navy-400">
                    <span>Shipping Fee</span>
                    <span className="text-green-600">FREE</span>
                 </div>
                 <div className="flex justify-between text-lg font-black text-navy-900 pt-2 border-t border-navy-100 mt-2">
                    <span>Total Paid</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                 </div>
              </div>
           </div>

           {/* Payment & Timeline Placeholder */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm">
                 <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CreditCard size={16} /> Payment Info
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-navy-400">Status</span>
                       <span className={`text-xs font-black uppercase px-2 py-1 rounded-lg ${
                         order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-navy-400">Transaction ID</span>
                       <span className="text-xs font-black text-navy-900">{order.paymentId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-navy-400">Gateway</span>
                       <span className="text-xs font-black text-navy-900">Razorpay</span>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/5 rounded-bl-full transform translate-x-12 -translate-y-12"></div>
                 <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Truck size={16} /> Shipping Status
                 </h3>
                 <div className="space-y-6 relative pl-4 border-l-2 border-navy-50">
                    <div className="relative">
                       <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-saffron border-4 border-white shadow-sm"></div>
                       <p className="text-xs font-black text-navy-900">Order Confirmed</p>
                       <p className="text-[10px] text-navy-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="relative opacity-50">
                       <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-navy-200 border-4 border-white"></div>
                       <p className="text-xs font-black text-navy-900">Shipped</p>
                       <p className="text-[10px] text-navy-400 font-bold">Pending</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Col: Customer & Address */}
        <div className="space-y-8">
           {/* Customer Profile Card */}
           <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm text-center relative overflow-hidden">
              <div className="w-24 h-24 bg-navy-900 rounded-[2rem] flex items-center justify-center text-saffron mx-auto mb-4 relative overflow-hidden shadow-2xl">
                 {order.user?.image ? (
                    <Image src={order.user.image} alt="User" fill className="object-cover" />
                 ) : (
                    <User size={40} />
                 )}
              </div>
              <h3 className="text-xl font-black text-navy-900 leading-tight">{order.user?.name || "Guest Customer"}</h3>
              <p className="text-sm font-bold text-navy-400 mb-6 italic">{order.user?.email}</p>
              
              <div className="h-px bg-navy-50 mb-6"></div>
              
              <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <Mail size={16} />
                    </div>
                    <span className="text-sm font-bold text-navy-600 truncate">{order.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                       <Phone size={16} />
                    </div>
                    <span className="text-sm font-bold text-navy-600">{order.user?.phone || "No phone provided"}</span>
                  </div>
              </div>
              
              <Link href={`/admin/customers/${order.userId}`} className="mt-8 block w-full py-3 rounded-xl bg-navy-50 text-navy-900 text-sm font-black hover:bg-saffron transition-all">
                 View Customer Profile
              </Link>
           </div>

           {/* Shipping Address Card */}
           <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm">
              <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <MapPin size={16} /> Delivery Address
              </h3>
              <div className="p-5 bg-navy-50/50 rounded-2xl border border-navy-100/50 relative">
                 <div className="absolute top-4 right-4 text-navy-200">
                   <MapPin size={24} />
                 </div>
                 <p className="text-sm font-bold text-navy-900 mb-1 leading-relaxed">
                   House No. 123, Sector 45<br />
                   Park Avenue, DLF Phase 1<br />
                   Gurgaon, Haryana<br />
                   122002, India
                 </p>
                 <p className="text-xs font-black text-saffron uppercase mt-4">Home Address</p>
              </div>
              <button className="w-full mt-6 py-2 rounded-xl text-xs font-bold text-navy-400 hover:text-navy-900 transition-colors flex items-center justify-center gap-2">
                 <MapPin size={14} /> Open in Google Maps
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
