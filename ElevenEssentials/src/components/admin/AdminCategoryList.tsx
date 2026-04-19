"use client";

import { useEffect, useState } from "react";
import { CategoryService } from "@/services/category.service";
import { Plus, Trash2, Edit3, Image as ImageIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminCategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    CategoryService.getAll().then(data => {
      setCategories(data);
      setLoading(false);
    });
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setNewCat({ ...newCat, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CategoryService.create(newCat);
      setNewCat({ name: "", slug: "", description: "" });
      setShowAdd(false);
      loadCategories();
    } catch (e) {
      alert("Failed to create category");
    }
  };

  if (loading) return <div>Loading Categories...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden text-left">
           <table className="w-full border-collapse">
              <thead>
                 <tr className="bg-navy-50/50 border-b border-navy-50">
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Category Name</th>
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Slug</th>
                    <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                 {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-navy-50/30 transition-colors">
                       <td className="p-4 pl-8">
                          <p className="text-sm font-black text-navy-900">{cat.name}</p>
                          <p className="text-xs text-navy-400 font-medium">{cat.description || 'No description'}</p>
                       </td>
                       <td className="p-4">
                          <code className="text-[10px] bg-navy-50 px-2 py-1 rounded text-navy-400 font-bold">{cat.slug}</code>
                       </td>
                       <td className="p-4 text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 transition-all"><Edit3 size={16}/></button>
                             <button className="p-2 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Add Form Area */}
      <div className="space-y-6">
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-navy-900 mb-2">Create Category</h2>
            <p className="text-xs text-navy-400 font-bold uppercase tracking-widest mb-8">Define product segments</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Category Name</label>
                   <input 
                     required
                     type="text" 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-saffron"
                     placeholder="e.g. Traditional Wear"
                     value={newCat.name}
                     onChange={(e) => handleNameChange(e.target.value)}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Slug</label>
                   <input 
                     readOnly
                     type="text" 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-mono text-navy-400 outline-none"
                     value={newCat.slug}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy-900 uppercase">Description</label>
                   <textarea 
                     className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-saffron min-h-[100px]"
                     placeholder="Brief description..."
                     value={newCat.description}
                     onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                   />
                </div>
                <Button className="w-full h-12 bg-navy-900 text-white rounded-xl font-bold shadow-xl shadow-navy-100 mt-4 group">
                   <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> Add Category
                </Button>
            </form>
         </div>
      </div>
    </div>
  );
}
