"use client";

import { useEffect, useState } from "react";
import { ProductService } from "@/services/product.service";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AdminProductListProps {
  onEdit: (product: any) => void;
  onAdd: () => void;
}

export function AdminProductList({ onEdit, onAdd }: AdminProductListProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    ProductService.getAllProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="bg-white rounded-3xl border border-navy-100 p-20 text-center space-y-4">
       <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
       <p className="text-navy-400 font-bold uppercase tracking-widest text-xs">Syncing Inventory...</p>
    </div>
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden text-left">
      {/* Product Toolbar */}
      <div className="p-6 border-b border-navy-50 flex items-center justify-between gap-4">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products by name, SKU, or slug..."
              className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-saffron outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/50">
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Product</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Category</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Base Price</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Stock</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {filteredProducts.map((product) => {
              const totalStock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;
              return (
                <tr key={product.id} className="hover:bg-navy-50/30 transition-colors group">
                  <td className="p-4 pl-8">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-navy-50 rounded-xl overflow-hidden relative border border-navy-100/50">
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full"><ImageIcon size={16} className="text-navy-200" /></div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-navy-900">{product.name}</p>
                        <p className="text-[10px] text-navy-400 font-bold tracking-tighter uppercase italic">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-navy-600 bg-navy-50 px-2 py-1 rounded-lg">Lifestyle</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-black text-navy-900">₹{product.variants?.[0]?.price?.toLocaleString() || "0"}</p>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${totalStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-sm font-bold text-navy-600">{totalStock} in stock</p>
                     </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                      product.isActive ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-400'
                    }`}>
                      {product.isActive ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(product)}
                          className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-navy-200 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
