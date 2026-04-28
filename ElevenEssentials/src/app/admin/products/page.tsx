"use client";

import { AdminProductList } from "@/components/admin/AdminProductList";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Product Inventory</h1>
          <p className="text-navy-400 font-medium">Manage your catalog, stock levels, and product visibility.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-saffron text-navy-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-saffron/20"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      <AdminProductList />
    </div>
  );
}
