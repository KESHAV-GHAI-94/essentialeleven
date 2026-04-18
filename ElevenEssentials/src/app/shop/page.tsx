import { ProductController } from "../../../../backend/src/controllers/product.controller.js";
import { ProductCard } from "@/components/products/ProductCard";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const productsRaw = await ProductController.listAll();

  // Map raw DB data to UI format
  const products = productsRaw.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.variants?.[0]?.price || 0,
    image: p.images?.[0] || "",
    category: p.category?.name || "Essentials",
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy-900 py-16 px-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-navy-900" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          The <span className="text-saffron">Essential</span> Collection
        </h1>
        <p className="text-navy-100 max-w-xl mx-auto opacity-80">
          Hand-picked premium essentials curated for those who demand excellence in every detail.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">All Products</h2>
            <p className="text-navy-400">{products.length} Items</p>
          </div>
          <div className="flex gap-4">
             {/* Filter placeholder for later */}
             <select className="bg-navy-50 border-none text-navy-600 text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-saffron">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
