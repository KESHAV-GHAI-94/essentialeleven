"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  TrendingUp,
  Store,
  Layers,
  Award,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Categories", icon: Layers, href: "/admin/categories" },
  { name: "Brands", icon: Award, href: "/admin/brands" },
  { name: "Customers", icon: Users, href: "/admin/customers" },
  { name: "Coupons", icon: Tag, href: "/admin/coupons" },
  { name: "Vendors", icon: Store, href: "/admin/vendors" },
  { name: "Analytics", icon: TrendingUp, href: "/admin/analytics" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-navy-900 text-white transition-all duration-300 flex flex-col sticky top-0 border-r border-white/5",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-saffron rounded-lg flex items-center justify-center">
              <span className="text-navy-900 font-black text-xl">E</span>
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">Eleven<span className="text-saffron">Admin</span></span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-saffron rounded-lg flex items-center justify-center mx-auto">
            <span className="text-navy-900 font-black text-xl">E</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-auto mr-[-10px]"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative",
                isActive 
                  ? "bg-saffron text-navy-900 font-bold" 
                  : "text-navy-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={isActive ? 20 : 18} className={cn(
                "shrink-0",
                isActive ? "text-navy-900" : "text-navy-400 group-hover:text-saffron"
              )} />
              {!collapsed && <span className="text-sm tracking-wide">{item.name}</span>}
              
              {/* Tooltip for collapsed mode */}
              {collapsed && (
                 <div className="absolute left-full ml-6 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl border border-white/5">
                    {item.name}
                 </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-white/5 space-y-1">
         <Link 
           href="/" 
           className={cn(
             "flex items-center gap-4 w-full px-4 py-3 rounded-xl text-navy-300 hover:bg-white/5 hover:text-saffron transition-all group",
             collapsed && "justify-center"
           )}
         >
           <ExternalLink size={18} />
           {!collapsed && <span className="text-sm font-bold">Visit Website</span>}
         </Link>

         <button 
           onClick={() => signOut({ callbackUrl: "/login" })}
           className={cn(
             "flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group",
             collapsed && "justify-center"
           )}
         >
           <LogOut size={18} />
           {!collapsed && <span className="text-sm font-bold">Logout</span>}
         </button>
      </div>
    </aside>
  );
}
