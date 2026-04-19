"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard, Product } from "@/components/products/ProductCard";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientProductGridProps {
  initialProducts: Product[];
}

export function ClientProductGrid({ initialProducts }: ClientProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [products] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || "Relevance");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0, 
    Number(searchParams.get('maxPrice')) || 100000
  ]);

  // Sync state changes to URL
  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Derived filters from product attributes
  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (selectedSort) {
      case "Price Low-High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price High-Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        result.reverse();
        break;
      case "Discount":
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSort, priceRange]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between gap-4 mb-4">
        <Button variant="outline" className="flex-1 flex gap-2" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </Button>
        <select 
          className="bg-navy-50 border border-navy-100 text-navy-900 text-sm rounded-md px-3 py-2 flex-1 focus:outline-saffron"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option>Relevance</option>
          <option>Price Low-High</option>
          <option>Price High-Low</option>
          <option>Newest</option>
          <option>Discount</option>
        </select>
      </div>

      {/* Sidebar Filters */}
      <aside className={`w-full md:w-64 shrink-0 transition-all ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-24 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-navy-50">
          
          <div>
            <h3 className="font-bold text-navy-900 mb-4 border-b pb-2 uppercase tracking-wider text-xs">Categories</h3>
            <div className="space-y-3">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 border border-navy-200 rounded-sm text-saffron focus:ring-saffron"
                    checked={selectedCategory === cat}
                    onChange={(e) => {
                       const value = e.target.checked ? cat as string : "";
                       setSelectedCategory(value);
                       updateUrl('category', value);
                    }}
                  />
                  <span className="text-sm text-navy-600 group-hover:text-navy-900">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-navy-900 mb-4 border-b pb-2 uppercase tracking-wider text-xs">Price Range</h3>
            <div className="space-y-4">
              <input 
                 type="range" 
                 min="0" 
                 max="15000" 
                 value={priceRange[1]} 
                 onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setPriceRange([priceRange[0], value]);
                 }}
                 onMouseUp={() => updateUrl('maxPrice', priceRange[1].toString())}
                 onTouchEnd={() => updateUrl('maxPrice', priceRange[1].toString())}
                 className="w-full accent-saffron"
              />
              <div className="flex justify-between items-center text-sm font-semibold text-navy-800">
                 <span>₹{priceRange[0]}</span>
                 <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Grid */}
      <div className="flex-1">
        {/* Desktop Sorting Bar */}
        <div className="hidden md:flex justify-between items-center mb-8 bg-navy-50 p-4 rounded-xl border border-navy-100">
          <p className="text-navy-600 text-sm font-medium">Showing <span className="font-bold text-navy-900">{filteredAndSorted.length}</span> Results</p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-widest">Sort by:</span>
            <select 
              className="bg-transparent font-semibold border-none text-navy-900 cursor-pointer focus:ring-0"
              value={selectedSort}
              onChange={(e) => {
                 setSelectedSort(e.target.value);
                 updateUrl('sort', e.target.value);
              }}
            >
              <option>Relevance</option>
              <option>Price Low-High</option>
              <option>Price High-Low</option>
              <option>Newest</option>
              <option>Discount</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.length > 0 ? (
            filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-navy-400">
              <p>No products match your filters.</p>
            </div>
          )}
        </div>
      </div>
    
    </div>
  );
}
