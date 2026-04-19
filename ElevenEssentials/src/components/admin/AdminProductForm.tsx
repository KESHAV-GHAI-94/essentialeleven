"use client";

import { useEffect, useState } from "react";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { MediaUploader } from "./MediaUploader";
import { X, Save, Plus, Trash2, Info, Image as ImageIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  product?: any; // If editing
}

export function AdminProductForm({ onClose, onSuccess, product }: ProductFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    categoryId: product?.categoryId || "",
    images: product?.images || [],
    isActive: product?.isActive ?? true,
    variants: product?.variants || [{ name: "Default", price: 0, stock: 0, sku: "" }]
  });

  useEffect(() => {
    CategoryService.getAll().then(setCategories);
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setFormData({ ...formData, name, slug });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: "", price: 0, stock: 0, sku: "" }]
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_: any, i: number) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await ProductService.updateProduct(product.id, formData);
      } else {
        await ProductService.createProduct(formData);
      }
      onSuccess();
    } catch (error) {
       alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
       <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={onClose}></div>
       
       <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-navy-50 flex items-center justify-between">
             <div>
                <h2 className="text-2xl font-black text-navy-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-sm text-navy-400 font-medium">Capture details for your premium store items.</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-navy-50 rounded-xl transition-colors">
                <X size={24} className="text-navy-400" />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
             {/* Basic Info */}
             <div className="space-y-4">
                <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest flex items-center gap-2">
                   <Info size={16} /> Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-navy-900 uppercase">Product Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="e.g. Premium Silk Scarf"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-navy-900 uppercase">URL Slug (Auto-generated)</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-navy-50 text-navy-400 border-none rounded-xl px-4 py-3 text-sm font-mono outline-none"
                        value={formData.slug}
                        readOnly
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-navy-900 uppercase">Category</label>
                      <select 
                        required
                        className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-saffron"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      >
                         <option value="">Select Category</option>
                         {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-navy-900 uppercase">Description</label>
                      <textarea 
                        className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-saffron min-h-[120px]"
                        placeholder="Describe your product..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             {/* Media Upload */}
             <div className="space-y-4">
                <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest flex items-center gap-2">
                   <ImageIcon size={16} /> Product Media
                </h3>
                <MediaUploader 
                  initialUrls={product?.images}
                  onUploadComplete={(urls) => setFormData({ ...formData, images: urls })} 
                />
             </div>

             {/* Variants & Pricing */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={16} /> Variants & Stock
                   </h3>
                   <Button 
                     type="button" 
                     variant="outline" 
                     onClick={addVariant}
                     className="text-[10px] h-7 border-navy-100 uppercase font-black tracking-widest"
                   >
                      <Plus size={12} className="mr-1" /> Add Variant
                   </Button>
                </div>
                
                <div className="space-y-4">
                   {formData.variants.map((variant: any, idx: number) => (
                      <div key={idx} className="p-4 bg-navy-50 rounded-2xl border border-navy-100 relative group">
                         {formData.variants.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeVariant(idx)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <Trash2 size={12} />
                            </button>
                         )}
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-navy-400 uppercase">Size/Color/Name</label>
                               <input 
                                 type="text" 
                                 className="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                 placeholder="e.g. Small / Red"
                                 value={variant.name}
                                 onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-navy-400 uppercase">SKU</label>
                               <input 
                                 type="text" 
                                 className="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                 placeholder="EE-PRD-001"
                                 value={variant.sku}
                                 onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-navy-400 uppercase">Price (₹)</label>
                               <input 
                                 type="number" 
                                 className="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                 value={variant.price}
                                 onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value))}
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-navy-400 uppercase">In Stock</label>
                               <input 
                                 type="number" 
                                 className="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                 value={variant.stock}
                                 onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value))}
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </form>

          {/* Footer Actions */}
          <div className="p-6 border-t border-navy-50 flex items-center gap-4 bg-navy-50/30">
             <Button 
               variant="outline" 
               className="flex-1 rounded-xl h-12 border-navy-100 text-navy-600 font-bold"
               onClick={onClose}
             >
                Cancel
             </Button>
             <Button 
               className="flex-[2] rounded-xl h-12 bg-navy-900 text-white font-bold flex gap-2 shadow-xl shadow-navy-100"
               onClick={handleSubmit}
               disabled={loading}
             >
                {loading ? "..." : <Save size={18} />}
                {product ? 'Update Product' : 'Publish Product'}
             </Button>
          </div>
       </div>
    </div>
  );
}
