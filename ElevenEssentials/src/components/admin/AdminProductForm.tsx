"use client";

import { useEffect, useState } from "react";
import { CategoryService } from "@/services/category.service";
import { BrandService } from "@/services/brand.service";
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
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    categoryId: product?.categoryId || "",
    brandId: product?.brandId || "",
    images: product?.images || [],
    isActive: product?.isActive ?? true,
    variants: product?.variants || [{ name: "Default", price: 0, originalPrice: 0, costPrice: 0, stock: 0, sku: "" }]
  });

  useEffect(() => {
    CategoryService.getAll().then(setCategories);
    BrandService.getAll().then(setBrands);
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setFormData({ ...formData, name, slug });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: "", price: 0, originalPrice: 0, costPrice: 0, stock: 0, sku: "" }]
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

  const tabs = [
    { id: "general", label: "General Info", icon: Info },
    { id: "media", label: "Media & Images", icon: ImageIcon },
    { id: "inventory", label: "Pricing & Stock", icon: Layers },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
       <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={onClose}></div>
       
       <div className="relative w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-navy-50 flex items-center justify-between bg-white sticky top-0 z-10">
             <div>
                <h2 className="text-2xl font-black text-navy-900 tracking-tight">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-sm text-navy-400 font-medium italic">Premium catalog orchestration</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-navy-50 rounded-xl transition-colors">
                <X size={24} className="text-navy-400" />
             </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex px-8 border-b border-navy-50 bg-navy-50/20">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                   activeTab === tab.id 
                    ? "border-saffron text-navy-900 bg-white shadow-[0_-4px_0_0_inset_#F59E0B]" 
                    : "border-transparent text-navy-300 hover:text-navy-900"
                 }`}
               >
                 <tab.icon size={16} />
                 {tab.label}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
             <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                {activeTab === "general" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Product Name</label>
                         <input 
                           required
                           type="text" 
                           className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-saffron transition-all"
                           placeholder="Premium Item Name"
                           value={formData.name}
                           onChange={(e) => handleNameChange(e.target.value)}
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">URL Slug</label>
                         <input 
                           required
                           readOnly
                           type="text" 
                           className="w-full bg-navy-50 text-navy-300 border-none rounded-xl px-4 py-3.5 text-sm font-mono outline-none"
                           value={formData.slug}
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Category</label>
                         <select 
                           required
                           className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-saffron"
                           value={formData.categoryId}
                           onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                         >
                            <option value="">Select Segment</option>
                            {categories.map(cat => (
                               <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Brand</label>
                         <select 
                           className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-saffron"
                           value={formData.brandId}
                           onChange={(e) => setFormData({...formData, brandId: e.target.value})}
                         >
                            <option value="">Independent / No Brand</option>
                            {brands.map(brand => (
                               <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                         </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-1">Description</label>
                       <textarea 
                         className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-saffron min-h-[160px]"
                         placeholder="Describe the premium essence of this product..."
                         value={formData.description}
                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       />
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-navy-50/30 p-6 rounded-3xl border border-dashed border-navy-100">
                      <MediaUploader 
                        initialUrls={formData.images}
                        onUploadComplete={(urls) => setFormData({ ...formData, images: urls })} 
                      />
                    </div>
                  </div>
                )}

                {activeTab === "inventory" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Pricing Matrix & Stock Units</p>
                       <Button 
                         type="button" 
                         variant="outline" 
                         onClick={addVariant}
                         className="text-[10px] h-8 border-navy-100 uppercase font-black tracking-widest bg-white"
                       >
                          <Plus size={14} className="mr-1" /> New Variant
                       </Button>
                    </div>
                    
                    <div className="space-y-4">
                       {formData.variants.map((variant: any, idx: number) => (
                          <div key={idx} className="p-6 bg-navy-50/50 rounded-3xl border border-navy-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-navy-100/50">
                             {formData.variants.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => removeVariant(idx)}
                                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 z-10"
                                >
                                   <Trash2 size={14} />
                                </button>
                             )}
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 col-span-2">
                                   <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Variant Name</label>
                                   <input 
                                     type="text" 
                                     className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-saffron"
                                     placeholder="e.g. Standard, Small, Blue"
                                     value={variant.name}
                                     onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Selling Price (₹)</label>
                                   <input 
                                     type="number" 
                                     className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-sm font-black outline-none focus:ring-2 focus:ring-saffron text-navy-900"
                                     value={variant.price}
                                     onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value))}
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest">MRP (Compare Price)</label>
                                   <input 
                                     type="number" 
                                     className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-saffron text-navy-300"
                                     value={variant.originalPrice}
                                     onChange={(e) => updateVariant(idx, 'originalPrice', parseFloat(e.target.value))}
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Cost Price (Supplier)</label>
                                   <input 
                                     type="number" 
                                     className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-saffron text-navy-400"
                                     value={variant.costPrice}
                                     onChange={(e) => updateVariant(idx, 'costPrice', parseFloat(e.target.value))}
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Stock Units</label>
                                   <input 
                                     type="number" 
                                     className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-saffron"
                                     value={variant.stock}
                                     onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value))}
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Target Profit Margin (%)</label>
                                   <div className="relative">
                                      <input 
                                        type="number" 
                                        placeholder="Min %"
                                        min="0"
                                        max="99"
                                        className="w-full bg-white border border-navy-50 rounded-xl pl-4 pr-8 py-2.5 text-sm font-black outline-none focus:ring-2 focus:ring-saffron text-indigo-600"
                                        value={variant.markup}
                                        onChange={(e) => {
                                          let val = parseFloat(e.target.value);
                                          if (val > 99) val = 99;
                                          if (val < 0) val = 0;
                                          updateVariant(idx, 'markup', val);
                                        }}
                                      />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-navy-300">%</span>
                                   </div>
                                 </div>
                             </div>
                             {variant.price > 0 && variant.costPrice > 0 && (
                               <div className="mt-6 pt-6 border-t border-navy-50 space-y-4">
                                  {/* High-Level Stats */}
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 group hover:bg-indigo-50 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reserved Profit</p>
                                        </div>
                                        <p className="text-xl font-black text-indigo-900">₹{(variant.price * (variant.markup / 100)).toFixed(0)}</p>
                                        <p className="text-[8px] text-indigo-400 font-bold mt-1 italic">Protected per unit sold</p>
                                     </div>

                                     <div className={`rounded-2xl p-4 border transition-all ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? 'bg-red-50 border-red-100' : 'bg-green-50/50 border-green-100/50 hover:bg-green-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                           <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                           <p className={`text-[10px] font-black uppercase tracking-widest ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? 'text-red-500' : 'text-green-600'}`}>Floor Price</p>
                                        </div>
                                        <p className={`text-xl font-black ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? 'text-red-900' : 'text-green-900'}`}>₹{((variant.costPrice || 0) + (variant.price * (variant.markup / 100))).toFixed(0)}</p>
                                        <p className="text-[8px] text-navy-400 font-bold mt-1 italic">Lowest checkout price</p>
                                     </div>
                                  </div>

                                  {/* Error/Info Note */}
                                  {((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? (
                                    <div className="bg-red-500 text-white p-3 rounded-xl flex items-center gap-3 shadow-lg shadow-red-100">
                                       <span className="text-lg">⚠️</span>
                                       <p className="text-[9px] font-black leading-tight uppercase">Margin is impossible! Floor price exceeds Sell price. Coupons will be disabled for this item.</p>
                                    </div>
                                  ) : (
                                    <div className="bg-navy-900 text-white/90 p-3 rounded-xl flex items-start gap-3 shadow-xl shadow-navy-100">
                                       <div className="bg-saffron rounded-full p-1 text-navy-900 mt-0.5"><span className="text-[8px] font-black">i</span></div>
                                       <p className="text-[9px] font-bold leading-relaxed">
                                          <span className="text-saffron uppercase">Security Note:</span> With a {variant.markup}% TPM, you are guaranteed at least ₹{(variant.price * (variant.markup / 100)).toFixed(0)} profit even after discounts. No coupon can drop the price below the Floor.
                                       </p>
                                    </div>
                                  )}

                                  {/* Indicators Bar */}
                                  <div className="flex items-center justify-between bg-white rounded-xl border border-navy-50 p-3">
                                     <div className="flex flex-col">
                                        <p className="text-[9px] text-navy-400 font-bold">NET PROFIT (MAX)</p>
                                        <p className="text-xs font-black text-navy-900">₹{(variant.price - variant.costPrice).toFixed(0)}</p>
                                     </div>
                                     <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black rounded-full">MARGIN: {(((variant.price - variant.costPrice) / variant.price) * 100).toFixed(1)}%</span>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-full">MARKUP: {(((variant.price - variant.costPrice) / variant.costPrice) * 100).toFixed(1)}%</span>
                                     </div>
                                  </div>
                               </div>
                             )}
                          </div>
                       ))}
                    </div>
                  </div>
                )}
             </form>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-navy-50 flex items-center gap-4 bg-white sticky bottom-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
             <Button 
               variant="outline" 
               className="flex-1 rounded-xl h-14 border-navy-100 text-navy-600 font-bold hover:bg-navy-50 transition-all"
               onClick={onClose}
             >
                Discard Changes
             </Button>
             <Button 
               form="product-form"
               className="flex-[2] rounded-xl h-14 bg-navy-900 text-white font-black text-base flex gap-2 shadow-xl shadow-navy-100 hover:scale-[1.02] active:scale-95 transition-all"
               disabled={loading}
             >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : <Save size={20} />}
                {product ? 'Synchronize Updates' : 'Commit to Catalog'}
             </Button>
          </div>
       </div>
    </div>
  );
}
