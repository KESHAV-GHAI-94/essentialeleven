"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentService } from "@/services/payment.service";

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
  status: string;
  paymentStatus: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      PaymentService.getOrderDetails(id as string)
        .then((res: any) => {
          setOrder(res);
        })
        .catch(err => {
          console.error("Order Load Error:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50/20">
        <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <Package className="w-16 h-16 text-navy-100 mb-4" />
        <h1 className="text-2xl font-black text-navy-900 mb-2">Order Not Found</h1>
        <p className="text-navy-400 mb-8 text-center max-w-xs">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/my-account/orders">
           <Button className="bg-navy-900 text-white rounded-xl px-8 h-12">Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Placed", status: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"], icon: Clock },
    { label: "Processing", status: ["PROCESSING", "SHIPPED", "DELIVERED"], icon: Package },
    { label: "Shipped", status: ["SHIPPED", "DELIVERED"], icon: Truck },
    { label: "Delivered", status: ["DELIVERED"], icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(step => step.status.includes(order.status));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      
      {/* Breadcrumb / Back */}
      <div className="mb-8">
        <Link href="/my-account/orders" className="flex items-center gap-2 text-navy-400 hover:text-navy-900 font-bold transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-navy-400 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl border-navy-100 font-bold text-navy-600">Download Invoice</Button>
           <Button className="rounded-xl bg-navy-900 text-white font-bold px-6">Track Order</Button>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-navy-100 shadow-sm mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-navy-50" />
        <div 
          className="absolute top-0 left-0 h-1.5 bg-saffron transition-all duration-1000" 
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx <= currentStepIndex;
              return (
                <div key={idx} className={`flex flex-col items-center text-center gap-3 ${isActive ? 'text-navy-900' : 'text-navy-200'}`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-navy-900 text-saffron shadow-lg' : 'bg-navy-50 text-navy-200'}`}>
                      <Icon className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-black uppercase tracking-widest text-[10px]">{step.label}</p>
                      {isActive && idx === currentStepIndex && <p className="text-[10px] font-bold text-green-600">Current Status</p>}
                   </div>
                </div>
              )
           })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content: Items */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl border border-navy-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-8">Ordered Items</h3>
              <div className="space-y-8">
                 {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-center">
                       <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-navy-50 border border-navy-100 shrink-0">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-black text-navy-900 text-lg leading-tight mb-2">{item.name}</h4>
                          <div className="flex gap-4">
                             <p className="text-sm font-bold text-navy-400">Qty: {item.quantity}</p>
                             <p className="text-sm font-bold text-navy-400">Price: ₹{item.price.toLocaleString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-navy-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="h-px bg-navy-50 my-8" />
              
              <div className="space-y-4">
                 <div className="flex justify-between font-bold text-navy-400 uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span className="text-navy-900">₹{order.total.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between font-bold text-navy-400 uppercase tracking-widest text-xs">
                    <span>Tax (GST)</span>
                    <span className="text-navy-900 text-[10px]">INCLUSIVE</span>
                 </div>
                 <div className="flex justify-between font-bold text-navy-400 uppercase tracking-widest text-xs">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                 </div>
                 <div className="pt-4 flex justify-between items-end border-t border-navy-50 mt-4">
                    <span className="text-sm font-black text-navy-900 uppercase tracking-widest">Total Amount Paid</span>
                    <span className="text-3xl font-black text-navy-900">₹{order.total.toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar: Details */}
        <div className="space-y-6">
           {/* Shipping Section */}
           <div className="bg-white rounded-3xl border border-navy-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                 <MapPin className="w-5 h-5 text-saffron" />
                 <h3 className="font-black text-navy-900 uppercase tracking-tight">Delivery Address</h3>
              </div>
              <div className="space-y-1">
                 <p className="font-bold text-navy-900">{order.address}</p>
                 <p className="text-navy-400 font-medium">{order.city}, {order.pincode}</p>
                 <div className="flex items-center gap-2 mt-4 text-navy-400 text-sm font-bold">
                    <Phone className="w-3.5 h-3.5" /> {order.phone}
                 </div>
              </div>
           </div>

           {/* Payment Section */}
           <div className="bg-white rounded-3xl border border-navy-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                 <CreditCard className="w-5 h-5 text-saffron" />
                 <h3 className="font-black text-navy-900 uppercase tracking-tight">Payment Details</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-navy-50/50 p-4 rounded-xl">
                    <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Status</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-saffron/10 text-saffron'}`}>
                       {order.paymentStatus}
                    </span>
                 </div>
                 <div className="flex items-center gap-2 text-navy-400 text-sm font-bold pl-1">
                    <Mail className="w-3.5 h-3.5" /> {order.email}
                 </div>
              </div>
           </div>

           {/* Re-order CTA */}
           <div className="bg-navy-900 rounded-3xl p-8 text-white">
              <h4 className="text-lg font-black text-saffron mb-2">Love these items?</h4>
              <p className="text-xs text-navy-200 font-medium mb-6">Get them again with a single click and have them delivered in 48 hours.</p>
              <Link href="/shop">
                <Button className="w-full bg-white text-navy-900 hover:bg-saffron font-black rounded-xl flex gap-2">
                   Continue Shopping <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
