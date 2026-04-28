"use client";

import { useEffect, useState } from "react";
import { ProductService } from "@/services/product.service";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  X,
  AlertTriangle
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = () => {
    ProductService.getAllProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (deleteConfirmName !== productToDelete?.name) return;
    setIsDeleting(true);
    try {
      await ProductService.deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setDeleteConfirmName("");
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

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
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
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
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-navy-600 bg-navy-50 px-2 py-1 rounded-lg block w-fit">
                        {product.category?.name || "Uncategorized"}
                      </span>
                      {product.brand && (
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 block w-fit">
                          {product.brand.name}
                        </span>
                      )}
                    </div>
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
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
                        product.isActive ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-400'
                      }`}>
                        {product.isActive ? 'ACTIVE' : 'DRAFT'}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {product.isNewArrival && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-saffron/10 text-amber-600 border border-saffron/30">
                            ✦ NEW
                          </span>
                        )}
                        {product.isTrending && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-500 border border-rose-200">
                            🔥 TREND
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteConfirmName("");
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-navy-200 hover:text-red-500 transition-all"
                        >
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

      {/* Deletion Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => !isDeleting && setProductToDelete(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => !isDeleting && setProductToDelete(null)} 
              className="absolute top-6 right-6 text-navy-200 hover:text-navy-900 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-navy-900 tracking-tight">Delete Product</h2>
              <p className="text-navy-600">
                You are about to delete <span className="font-bold text-navy-900">{productToDelete.name}</span>. This action cannot be undone and will remove all variants and inventory data.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-navy-400 uppercase tracking-widest">
                Type <span className="text-navy-900 bg-navy-50 px-2 py-0.5 rounded">{productToDelete.name}</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder={productToDelete.name}
                className="w-full bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <Button
              onClick={handleDelete}
              disabled={deleteConfirmName !== productToDelete.name || isDeleting}
              className="w-full rounded-xl h-14 bg-red-500 hover:bg-red-600 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
