import { ProductController } from "../../../../backend/src/controllers/product.controller.js";
import { ClientProductGrid } from "@/components/shop/ClientProductGrid";
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

      {/* Grid Platform */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ClientProductGrid initialProducts={products} />
      </div>
    </div>
  );
}
