"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Package, UserPlus, AlertCircle, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/notifications/admin");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "NEW_ORDER": return <Package className="text-navy-900" size={16} />;
      case "NEW_USER": return <UserPlus className="text-blue-500" size={16} />;
      case "OUT_OF_STOCK": return <AlertCircle className="text-red-500" size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-navy-50 rounded-xl transition-all text-navy-600 border border-transparent hover:border-navy-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-saffron text-navy-900 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-navy-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-navy-50 flex items-center justify-between bg-navy-50/30">
            <h3 className="font-black text-navy-900 text-sm uppercase tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-black text-navy-400 hover:text-navy-900 uppercase tracking-widest flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-navy-100 mb-2" />
                <p className="text-xs font-bold text-navy-300">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-navy-50 last:border-0 hover:bg-navy-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-saffron/[0.03]' : ''}`}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-saffron/10' : 'bg-navy-50'}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.isRead ? 'font-bold text-navy-900' : 'text-navy-600 font-medium'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] font-bold text-navy-300 mt-1 uppercase">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 bg-saffron rounded-full mt-1 shrink-0 shadow-sm" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-navy-50/50 text-center border-t border-navy-50">
            <Link 
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-black text-navy-900 uppercase tracking-widest hover:underline block"
            >
              View All Activities
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
