"use client";

import { useEffect, useState } from "react";
import { InventoryService } from "@/services/inventory.service";
import { 
  Package, 
  AlertTriangle, 
  Search, 
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  Lock
} from "lucide-react";
import Image from "next/image";

export function AdminInventoryPanel() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    InventoryService.getInventory().then(data => {
      setInventory(data);
      setLoading(false);
    });
  }, []);

  const handleStockUpdate = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await InventoryService.updateStock(id, newStock);
      setInventory(inventory.map(item => item.id === id ? { ...item, stock: newStock } : item));
    } catch (e) {
      alert("Failed to update stock");
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading Inventory...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
               <Package size={24} />
            </div>
            <div>
               <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Total SKU's</p>
               <p className="text-2xl font-black text-navy-900">{inventory.length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
               <AlertTriangle size={24} />
            </div>
            <div>
               <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Low Stock</p>
               <p className="text-2xl font-black text-navy-900">{inventory.filter(i => i.stock < 10).length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
               <RefreshCw size={24} />
            </div>
            <div>
               <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Out of Stock</p>
               <p className="text-2xl font-black text-navy-900">{inventory.filter(i => i.stock === 0).length}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-navy-50 flex items-center justify-between gap-4">
           <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by Product or SKU"
                className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="text-xs font-bold text-navy-400 hover:text-navy-900 transition-colors uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={14} /> Refresh Grid
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-50/50">
                <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Variant / SKU</th>
                <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Product</th>
                <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-center">Current Stock</th>
                <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-navy-50/30 transition-colors group">
                  <td className="p-4 pl-8">
                     <p className="text-sm font-black text-navy-900">{item.name || 'Default'}</p>
                     <p className="text-[10px] text-navy-400 font-bold uppercase tracking-tight">{item.sku}</p>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy-50 rounded-lg relative overflow-hidden border border-navy-100">
                           {item.product?.images?.[0] && <Image src={item.product.images[0]} alt="p" fill className="object-cover" />}
                        </div>
                        <p className="text-xs font-bold text-navy-600 truncate max-w-[150px]">{item.product?.name}</p>
                     </div>
                  </td>
                  <td className="p-4 text-center">
                     <span className={cn(
                        "text-sm font-black",
                        item.stock < 10 ? "text-red-600" : "text-navy-900"
                     )}>
                        {item.stock}
                     </span>
                  </td>
                  <td className="p-4">
                     {item.stock === 0 ? (
                        <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded-lg">OUT OF STOCK</span>
                     ) : item.stock < 10 ? (
                        <span className="text-[10px] font-black bg-saffron/10 text-saffron px-2 py-1 rounded-lg">LOW STOCK</span>
                     ) : (
                        <span className="text-[10px] font-black bg-green-100 text-green-600 px-2 py-1 rounded-lg">IN STOCK</span>
                     )}
                  </td>
                  <td className="p-4 text-right pr-8">
                     <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleStockUpdate(item.id, item.stock, -1)}
                          className="w-8 h-8 rounded-lg border border-navy-100 flex items-center justify-center text-navy-400 hover:bg-navy-50 transition-all font-bold"
                        >
                          <Minus size={14} />
                        </button>
                        <button 
                          onClick={() => handleStockUpdate(item.id, item.stock, 1)}
                          className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center hover:bg-saffron hover:text-navy-900 transition-all font-bold"
                        >
                          <Plus size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
   return classes.filter(Boolean).join(" ");
}
