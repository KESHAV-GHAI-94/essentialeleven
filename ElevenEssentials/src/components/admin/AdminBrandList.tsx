"use client";

import { useEffect, useState } from "react";
import { BrandService } from "@/services/brand.service";
import { Plus, Trash2, Edit3, Image as ImageIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminBrandList() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBrand, setNewBrand] = useState({ name: "", slug: "", description: "", logo: "" });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = () => {
    BrandService.getAll().then(data => {
      setBrands(data);
      setLoading(false);
    });
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setNewBrand({ ...newBrand, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await BrandService.create(newBrand);
      setNewBrand({ name: "", slug: "", description: "", logo: "" });
      loadBrands();
    } catch (e) {
      alert("Failed to create brand");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await BrandService.delete(id);
      loadBrands();
    } catch (e) {
      alert("Failed to delete brand");
    }
  };

  if (loading) return <div>Loading Brands...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      {/* List Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
           <table className="w-full border-collapse">
              <thead>
                 <tr className="bg-navy-50/50 border-b border-navy-50">
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Brand Name</th>
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Slug</th>
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-center">Products</th>
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                 {brands.map(brand => (
                    <tr key={brand.id} className="hover:bg-navy-50/30 transition-colors">
                       <td className="p-4 pl-8">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center overflow-hidden shrink-0">
                                {brand.logo ? (
                                   <img 
                                     src={brand.logo} 
                                     alt={brand.name} 
                                     className="w-full h-full object-cover"
                                     onError={(e: any) => {
                                       e.target.style.display = 'none';
                                       e.target.nextSibling.style.display = 'flex';
                                     }}
                                   />
                                ) : null}
                                <div className={`${brand.logo ? 'hidden' : 'flex'} items-center justify-center text-navy-200`}>
                                   <ImageIcon size={14} />
                                </div>
                             </div>
                             <div>
                                <p className="text-sm font-black text-navy-900">{brand.name}</p>
                                <p className="text-[10px] text-navy-400 font-medium line-clamp-1">{brand.description || 'No description'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-4">
                          <code className="text-[10px] bg-navy-50 px-2 py-1 rounded text-navy-400 font-bold">{brand.slug}</code>
                       </td>
                       <td className="p-4 text-center">
                          <span className="text-xs font-black text-navy-900 bg-navy-50 px-2 py-1 rounded-full border border-navy-100">
                             {brand._count?.products || 0}
                          </span>
                       </td>
                       <td className="p-4 text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 transition-all"><Edit3 size={16}/></button>
                             <button 
                               onClick={() => handleDelete(brand.id)}
                               className="p-2 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-all"
                             >
                               <Trash2 size={16}/>
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {brands.length === 0 && (
                   <tr>
                     <td colSpan={4} className="p-20 text-center text-navy-300 font-bold italic">
                       No brands found. Create one on the right.
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Add Form Area */}
      <div className="space-y-6">
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-navy-900 mb-2">Register Brand</h2>
            <p className="text-xs text-navy-400 font-bold uppercase tracking-widest mb-8">Establish a new identity</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Brand Name</label>
                   <input 
                     required
                     type="text" 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-saffron"
                     placeholder="e.g. Nike, Adidas"
                     value={newBrand.name}
                     onChange={(e) => handleNameChange(e.target.value)}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Slug</label>
                   <input 
                     readOnly
                     type="text" 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-mono text-navy-400 outline-none"
                     value={newBrand.slug}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Logo URL (Optional)</label>
                   <input 
                     type="url" 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-saffron"
                     placeholder="https://..."
                     value={newBrand.logo}
                     onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Description</label>
                   <textarea 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-saffron min-h-[100px]"
                     placeholder="About the brand..."
                     value={newBrand.description}
                     onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                   />
                </div>
                <Button className="w-full h-12 bg-navy-900 text-white rounded-xl font-bold shadow-xl shadow-navy-100 mt-4 group">
                   <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> Create Brand
                </Button>
            </form>
         </div>
      </div>
    </div>
  );
}
