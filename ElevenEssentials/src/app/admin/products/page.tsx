"use client";

import { useState } from "react";
import { AdminProductList } from "@/components/admin/AdminProductList";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    handleClose();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Product Inventory</h1>
          <p className="text-navy-400 font-medium">Manage your catalog, stock levels, and product visibility.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-saffron text-navy-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-saffron/20"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <AdminProductList 
        key={refreshKey} 
        onEdit={handleEdit} 
        onAdd={handleAdd} 
      />

      {showForm && (
        <AdminProductForm 
          onClose={handleClose} 
          onSuccess={handleSuccess} 
          product={editingProduct}
        />
      )}
    </div>
  );
}
