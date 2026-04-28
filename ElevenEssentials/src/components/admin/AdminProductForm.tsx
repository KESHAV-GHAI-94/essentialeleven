"use client";

import { useEffect, useState } from "react";
import { CategoryService } from "@/services/category.service";
import { BrandService } from "@/services/brand.service";
import { ProductService } from "@/services/product.service";
import { MediaUploader } from "./MediaUploader";
import { ArrowLeft, Save, Plus, Trash2, Info, Image as ImageIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AdminProductFormProps {
  product?: any;
}

export function AdminProductForm({ product }: AdminProductFormProps) {
  const router = useRouter();
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
    isNewArrival: product?.isNewArrival ?? false,
    isTrending: product?.isTrending ?? false,
    couponApplicable: product?.couponApplicable || "yes",
    variants: product?.variants || [{ name: "Default", price: 0, originalPrice: 0, costPrice: 0, stock: 0, sku: "", markup: 0 }],
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
      variants: [...formData.variants, { name: "", price: 0, originalPrice: 0, costPrice: 0, stock: 0, sku: "", markup: 0 }],
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
      variants: formData.variants.filter((_: any, i: number) => i !== index),
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
      alert(`Product ${product ? "updated" : "created"} successfully!`);
      router.push('/admin/products');
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

  const couponOptions: { value: string; label: string; desc: string; color: string }[] = [
    { value: "yes",             label: "Yes — All Coupons",    desc: "Both flat & % coupons work", color: "green"  },
    { value: "no",              label: "No — Coupons Blocked", desc: "No discount allowed",        color: "red"    },
    { value: "flat_only",       label: "Flat Amount Only",      desc: "Only fixed ₹ discounts",     color: "blue"   },
    { value: "percentage_only", label: "Percentage Only",       desc: "Only % discounts",           color: "indigo" },
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2.5 bg-white border border-navy-100 hover:bg-navy-50 rounded-xl transition-all shadow-sm group"
            >
              <ArrowLeft size={20} className="text-navy-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-navy-900 tracking-tight">
                {product ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm text-navy-400 font-medium italic mt-1">Premium catalog orchestration</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex px-8 border-b border-navy-50 bg-navy-50/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
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

            {/* ── GENERAL TAB ── */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Name + Slug */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-navy-400 uppercase tracking-widest pl-1">Product Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-base font-semibold outline-none focus:ring-2 focus:ring-saffron transition-all"
                      placeholder="Premium Item Name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-navy-400 uppercase tracking-widest pl-1">URL Slug</label>
                    <input
                      required
                      readOnly
                      type="text"
                      className="w-full bg-navy-50 text-navy-300 border-none rounded-xl px-4 py-3.5 text-base font-mono outline-none"
                      value={formData.slug}
                    />
                  </div>
                </div>

                {/* Category + Brand */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-navy-400 uppercase tracking-widest pl-1">Category</label>
                    <select
                      required
                      className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-base font-semibold outline-none focus:ring-2 focus:ring-saffron"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="">Select Segment</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-navy-400 uppercase tracking-widest pl-1">Brand</label>
                    <select
                      className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-base font-semibold outline-none focus:ring-2 focus:ring-saffron"
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    >
                      <option value="">Independent / No Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-navy-400 uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    className="w-full bg-navy-50 border-none rounded-xl px-4 py-3.5 text-base font-medium outline-none focus:ring-2 focus:ring-saffron min-h-[140px]"
                    placeholder="Describe the premium essence of this product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* ── Homepage Visibility Flags ── */}
                <div className="bg-navy-50/40 rounded-2xl p-5 border border-navy-100/60 space-y-4">
                  <p className="text-sm font-bold text-navy-400 uppercase tracking-widest">Homepage Visibility Flags</p>
                  <div className="grid grid-cols-2 gap-4">

                    {/* New Arrival */}
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                      formData.isNewArrival ? "border-saffron bg-saffron/5 shadow-sm" : "border-navy-100 bg-white hover:border-navy-200"
                    }`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        formData.isNewArrival ? "bg-saffron border-saffron" : "border-navy-200"
                      }`}>
                        {formData.isNewArrival && (
                          <svg className="w-3 h-3 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.isNewArrival}
                        onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      />
                      <div>
                        <p className="text-sm font-bold text-navy-900">New Arrival</p>
                        <p className="text-sm text-navy-400 font-medium mt-0.5">Show in New Arrivals carousel</p>
                      </div>
                    </label>

                    {/* Trending */}
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                      formData.isTrending ? "border-rose-400 bg-rose-50/40 shadow-sm" : "border-navy-100 bg-white hover:border-navy-200"
                    }`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        formData.isTrending ? "bg-rose-400 border-rose-400" : "border-navy-200"
                      }`}>
                        {formData.isTrending && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.isTrending}
                        onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      />
                      <div>
                        <p className="text-sm font-bold text-navy-900">Trending Essential</p>
                        <p className="text-sm text-navy-400 font-medium mt-0.5">Show in Trending carousel</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* ── Coupon Applicable ── */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy-400 uppercase tracking-widest pl-1">Coupon Applicable</label>
                  <div className="grid grid-cols-2 gap-3">
                    {couponOptions.map((opt) => {
                      const active = formData.couponApplicable === opt.value;
                      const activeBorder =
                        opt.color === "green"  ? "border-green-400 bg-green-50/40"   :
                        opt.color === "red"    ? "border-red-400 bg-red-50/40"       :
                        opt.color === "blue"   ? "border-blue-400 bg-blue-50/40"     :
                                                 "border-indigo-400 bg-indigo-50/40";
                      const activeDot =
                        opt.color === "green"  ? "border-green-400 bg-green-400"     :
                        opt.color === "red"    ? "border-red-400 bg-red-400"         :
                        opt.color === "blue"   ? "border-blue-400 bg-blue-400"       :
                                                 "border-indigo-400 bg-indigo-400";
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                            active ? activeBorder : "border-navy-100 bg-white hover:border-navy-200"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${
                            active ? activeDot : "border-navy-200"
                          }`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <input
                            type="radio"
                            className="hidden"
                            name="couponApplicable"
                            value={opt.value}
                            checked={active}
                            onChange={() => setFormData({ ...formData, couponApplicable: opt.value })}
                          />
                          <div>
                            <p className="text-sm font-bold text-navy-900 leading-tight">{opt.label}</p>
                            <p className="text-sm text-navy-400 font-medium mt-0.5">{opt.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── MEDIA TAB ── */}
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

            {/* ── INVENTORY TAB ── */}
            {activeTab === "inventory" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-navy-400 uppercase tracking-widest">Pricing Matrix & Stock Units</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    className="text-sm h-8 border-navy-100 uppercase font-bold tracking-widest bg-white"
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
                          <label className="text-sm font-bold text-navy-400 uppercase tracking-widest">Variant Name</label>
                          <input
                            type="text"
                            className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-saffron"
                            placeholder="e.g. Standard, Small, Blue"
                            value={variant.name}
                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-navy-400 uppercase tracking-widest">Selling Price (₹)</label>
                          <input
                            type="number"
                            className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-saffron text-navy-900"
                            value={variant.price}
                            onChange={(e) => updateVariant(idx, "price", parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-navy-400 uppercase tracking-widest">MRP (Compare Price)</label>
                          <input
                            type="number"
                            className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-saffron text-navy-300"
                            value={variant.originalPrice}
                            onChange={(e) => updateVariant(idx, "originalPrice", parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-navy-400 uppercase tracking-widest">Cost Price (Supplier)</label>
                          <input
                            type="number"
                            className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-saffron text-navy-400"
                            value={variant.costPrice}
                            onChange={(e) => updateVariant(idx, "costPrice", parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-navy-400 uppercase tracking-widest">Stock Units</label>
                          <input
                            type="number"
                            className="w-full bg-white border border-navy-50 rounded-xl px-4 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-saffron"
                            value={variant.stock}
                            onChange={(e) => updateVariant(idx, "stock", parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-navy-400 uppercase tracking-widest">Target Profit Margin (%)</label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Min %"
                              min="0"
                              max="99"
                              className="w-full bg-white border border-navy-50 rounded-xl pl-4 pr-8 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-saffron text-indigo-600"
                              value={variant.markup}
                              onChange={(e) => {
                                let val = parseFloat(e.target.value);
                                if (val > 99) val = 99;
                                if (val < 0) val = 0;
                                updateVariant(idx, "markup", val);
                              }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-navy-300">%</span>
                          </div>
                        </div>
                      </div>

                      {variant.price > 0 && variant.costPrice > 0 && (
                        <div className="mt-6 pt-6 border-t border-navy-50 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Reserved Profit</p>
                              </div>
                              <p className="text-xl font-bold text-indigo-900">₹{(variant.price * (variant.markup / 100)).toFixed(0)}</p>
                              <p className="text-[11px] text-indigo-400 font-bold mt-1 italic">Protected per unit sold</p>
                            </div>
                            <div className={`rounded-2xl p-4 border transition-all ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? "bg-red-50 border-red-100" : "bg-green-50/50 border-green-100/50 hover:bg-green-50"}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                                <p className={`text-sm font-bold uppercase tracking-widest ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? "text-red-500" : "text-green-600"}`}>Floor Price</p>
                              </div>
                              <p className={`text-xl font-bold ${((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? "text-red-900" : "text-green-900"}`}>₹{((variant.costPrice || 0) + (variant.price * (variant.markup / 100))).toFixed(0)}</p>
                              <p className="text-[11px] text-navy-400 font-bold mt-1 italic">Lowest checkout price</p>
                            </div>
                          </div>

                          {((variant.costPrice || 0) + (variant.price * (variant.markup / 100))) > variant.price ? (
                            <div className="bg-red-500 text-white p-3 rounded-xl flex items-center gap-3 shadow-lg shadow-red-100">
                              <span className="text-lg">⚠️</span>
                              <p className="text-sm font-bold leading-tight uppercase">Margin is impossible! Floor price exceeds Sell price. Coupons will be disabled for this item.</p>
                            </div>
                          ) : (
                            <div className="bg-navy-900 text-white/90 p-3 rounded-xl flex items-start gap-3 shadow-xl shadow-navy-100">
                              <div className="bg-saffron rounded-full p-1 text-navy-900 mt-0.5"><span className="text-[11px] font-bold">i</span></div>
                              <p className="text-sm font-bold leading-relaxed">
                                <span className="text-saffron uppercase">Security Note:</span> With a {variant.markup}% TPM, you are guaranteed at least ₹{(variant.price * (variant.markup / 100)).toFixed(0)} profit even after discounts. No coupon can drop the price below the Floor.
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between bg-white rounded-xl border border-navy-50 p-3">
                            <div className="flex flex-col">
                              <p className="text-sm text-navy-400 font-bold">NET PROFIT (MAX)</p>
                              <p className="text-sm font-bold text-navy-900">₹{(variant.price - variant.costPrice).toFixed(0)}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">MARGIN: {(((variant.price - variant.costPrice) / variant.price) * 100).toFixed(1)}%</span>
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">MARKUP: {(((variant.price - variant.costPrice) / variant.costPrice) * 100).toFixed(1)}%</span>
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

        {/* Footer */}
        <div className="p-6 border-t border-navy-50 flex items-center gap-4 bg-white sticky bottom-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-14 border-navy-100 text-navy-600 font-bold hover:bg-navy-50 transition-all"
            onClick={() => router.back()}
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
            ) : (
              <Save size={20} />
            )}
            {product ? "Synchronize Updates" : "Commit to Catalog"}
          </Button>
        </div>
      </div>
    </div>
  );
}
