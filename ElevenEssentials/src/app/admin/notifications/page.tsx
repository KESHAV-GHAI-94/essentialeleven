"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Package, 
  UserPlus, 
  AlertCircle, 
  Check, 
  Trash2,
  Filter,
  Calendar,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/notifications/admin");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:4000/api/notifications/mark-all-read`, { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "NEW_ORDER": return <Package className="text-navy-900" size={20} />;
      case "NEW_USER": return <UserPlus className="text-blue-500" size={20} />;
      case "OUT_OF_STOCK": return <AlertCircle className="text-red-500" size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "ORDERS") return n.type === "NEW_ORDER";
    if (filter === "USERS") return n.type === "NEW_USER";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-navy-900 tracking-tight">Activity History</h2>
          <p className="text-navy-400 font-medium mt-1">Manage and review all administrative alerts and events</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-navy-100 font-bold text-navy-600 px-6 h-12 flex gap-2"
            onClick={markAllAsRead}
          >
            <Check size={18} /> Mark All Read
          </Button>
          <Link href="/admin/notifications/settings">
            <Button 
              className="rounded-xl bg-navy-900 text-white font-bold px-6 h-12 flex gap-2 shadow-lg"
            >
              Notification Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2.5rem] border border-navy-100 shadow-xl overflow-hidden min-h-[600px]">
        
        {/* Toolbar */}
        <div className="p-8 border-b border-navy-50 flex flex-wrap items-center justify-between gap-6 bg-navy-50/20">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setFilter("ALL")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${filter === "ALL" ? 'bg-navy-900 text-saffron shadow-lg' : 'bg-white border border-navy-100 text-navy-400'}`}
              >
                All Events
              </button>
              <button 
                onClick={() => setFilter("UNREAD")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${filter === "UNREAD" ? 'bg-navy-900 text-saffron shadow-lg' : 'bg-white border border-navy-100 text-navy-400'}`}
              >
                Unread
              </button>
              <button 
                onClick={() => setFilter("ORDERS")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${filter === "ORDERS" ? 'bg-navy-900 text-saffron shadow-lg' : 'bg-white border border-navy-100 text-navy-400'}`}
              >
                Orders
              </button>
           </div>
           
           <div className="flex items-center gap-4 text-navy-400 text-sm font-bold">
              <Calendar size={18} />
              <span>Last 30 Days</span>
           </div>
        </div>

        {/* List */}
        <div className="divide-y divide-navy-50">
           {loading ? (
             <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto" />
             </div>
           ) : filtered.length === 0 ? (
             <div className="p-20 text-center">
                <Bell size={64} className="mx-auto text-navy-100 mb-6" />
                <h3 className="text-xl font-bold text-navy-900 mb-2">Clean Slate!</h3>
                <p className="text-navy-300 font-medium">No alerts matching your current filter.</p>
             </div>
           ) : (
             filtered.map((n) => (
               <div 
                 key={n.id} 
                 className={`p-8 hover:bg-navy-50/50 transition-all group relative cursor-pointer ${!n.isRead ? 'bg-saffron/[0.02]' : ''}`}
                 onClick={() => !n.isRead && markAsRead(n.id)}
               >
                 <div className="flex gap-8 items-center">
                    {/* Icon Column */}
                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 transition-all ${!n.isRead ? 'bg-navy-900 text-saffron shadow-xl -rotate-3' : 'bg-navy-50 text-navy-300'}`}>
                       {getIcon(n.type)}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${!n.isRead ? 'bg-saffron/20 text-navy-900' : 'bg-navy-100 text-navy-400'}`}>
                             {n.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-navy-300 uppercase">
                             {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                       </div>
                       <h4 className={`text-lg transition-colors ${!n.isRead ? 'font-black text-navy-900' : 'text-navy-600 font-semibold'}`}>
                          {n.message}
                       </h4>
                    </div>

                    {/* Action Column */}
                    <div className="shrink-0 flex items-center gap-4">
                       {!n.isRead && <div className="w-2.5 h-2.5 bg-saffron rounded-full shadow-lg animate-pulse" />}
                       <button className="p-3 bg-navy-50 text-navy-400 rounded-xl hover:bg-navy-900 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                          <ChevronRight size={18} />
                       </button>
                    </div>
                 </div>
               </div>
             ))
           )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-navy-50/20 text-center">
           <p className="text-sm font-bold text-navy-300">Viewing your recent administrative activity logs</p>
        </div>
      </div>
    </div>
  );
}
