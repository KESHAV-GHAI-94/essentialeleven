"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Bell, Search, User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Dynamic Title Mapping
  const getPageTitle = () => {
    if (!pathname) return "Dashboard Overview";
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return "Dashboard Overview";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-navy-100 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-12">
              <h1 className="text-2xl font-black text-navy-900 tracking-tight whitespace-nowrap">
                {getPageTitle()}
              </h1>
              
              <div className="flex items-center gap-4 bg-navy-50 px-4 py-2.5 rounded-xl w-96 border border-navy-100/50 focus-within:ring-2 focus-within:ring-saffron/20 transition-all">
                <Search size={18} className="text-navy-400" />
                <input 
                  type="text" 
                  placeholder="Search orders, products, customers..." 
                  className="bg-transparent border-none outline-none text-sm font-medium w-full text-navy-900 placeholder:text-navy-300"
                />
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2 hover:bg-navy-50 rounded-full transition-colors text-navy-600">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-saffron rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-navy-100"></div>

              <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-navy-900 leading-tight">Admin User</p>
                    <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Super Admin</p>
                 </div>
                 <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-saffron">
                    <User size={20} />
                 </div>
              </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
