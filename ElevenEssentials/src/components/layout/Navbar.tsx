"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { CartIcon } from "../cart/CartIcon";
import { 
  User, 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Package, 
  Watch, 
  Laptop, 
  Sparkles 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSyncRecentlyViewed } from "@/hooks/useSyncRecentlyViewed";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { 
    name: "Shop", 
    href: "/shop",
    hasMegaMenu: true,
    categories: [
      { name: "Obsidian", icon: Watch, desc: "Premium Timepieces" },
      { name: "Meridian", icon: Laptop, desc: "Performance Gear" },
      { name: "Staples", icon: Package, desc: "Daily Essentials" },
      { name: "Limited", icon: Sparkles, desc: "Exclusive Drops" },
    ]
  },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  useSyncRecentlyViewed(); // Auto-syncs on login
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 px-6 border-b border-white/5",
        isScrolled 
          ? "bg-navy-900/95 backdrop-blur-md shadow-lg py-3" 
          : "bg-navy-900/40 backdrop-blur-sm py-4"
      )}
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
           className="lg:hidden text-white p-2"
           onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-saffron flex items-center justify-center font-bold text-navy-900 group-hover:rotate-12 transition-transform">
            E11
          </div>
          <span className="text-xl font-bold text-white tracking-tighter hidden sm:inline-block">
            ESSENTIAL <span className="text-saffron">ELEVEN</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <div 
               key={link.href} 
               className="relative"
               onMouseEnter={() => link.hasMegaMenu && setActiveMegaMenu(link.name)}
            >
              <Link
                href={link.href}
                className={cn(
                  "text-[11px] font-bold transition-colors hover:text-saffron uppercase tracking-[0.2em] flex items-center gap-1",
                  pathname === link.href ? "text-saffron" : "text-navy-100/80"
                )}
              >
                {link.name}
                {link.hasMegaMenu && <ChevronDown className="w-3 h-3" />}
              </Link>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setIsSearchOpen(!isSearchOpen)}
             className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {status === "authenticated" ? (
            <div className="relative group">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-navy-900 font-bold text-xs">
                  {session.user?.name?.[0] || "U"}
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-navy-900 border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[70] overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <p className="text-[10px] text-navy-300 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                </div>
                <div className="py-2">
                  <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-navy-100 hover:bg-white/5 hover:text-saffron transition-colors">
                    <User className="w-4 h-4" /> Account Settings
                  </Link>
                  <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-navy-100 hover:bg-white/5 hover:text-saffron transition-colors">
                    <Package className="w-4 h-4" /> Order History
                  </Link>
                </div>
                <div className="border-t border-white/5 py-2">
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <User className="w-5 h-5" />
            </Link>
          )}
          
          <CartIcon />
        </div>
      </div>

      {/* Mega Menu Content */}
      {activeMegaMenu === "Shop" && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-navy-100 animate-in slide-in-from-top-2 duration-300">
              <div className="max-w-5xl mx-auto grid grid-cols-4 gap-8 py-12 px-6">
                {NAV_LINKS.find(l => l.name === "Shop")?.categories?.map((cat) => (
                    <Link key={cat.name} href={`/shop?cat=${cat.name.toLowerCase()}`} className="group flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mb-4 group-hover:bg-saffron transition-colors">
                            <cat.icon className="w-6 h-6 text-navy-900" />
                        </div>
                        <h4 className="font-bold text-navy-900 text-sm mb-1">{cat.name}</h4>
                        <p className="text-xs text-navy-400">{cat.desc}</p>
                    </Link>
                ))}
              </div>
          </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-navy-900 p-6 animate-in fade-in duration-200">
              <div className="max-w-3xl mx-auto relative capitalize">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                   <input 
                      autoFocus
                      placeholder="Search for premium essentials..." 
                      className="w-full bg-navy-800 border-none rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-navy-500 focus:ring-2 focus:ring-saffron"
                   />
              </div>
          </div>
      )}

      {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                <div className="w-64 h-screen bg-navy-900 p-8 flex flex-col gap-6 animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-8">
                        <span className="font-bold text-white text-lg">Menu</span>
                        <X className="w-6 h-6 text-white cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
                    </div>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                "text-lg font-medium transition-colors",
                                pathname === link.href ? "text-saffron" : "text-white"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        )}
    </nav>
  );
}
