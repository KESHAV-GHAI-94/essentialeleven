import { Metadata } from 'next';
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ProductQA } from "@/components/products/ProductQA";
import { ProductController } from "../../../../../backend/src/controllers/product.controller.js";
import Script from "next/script";
import { notFound } from "next/navigation";

// Task 18: Open Graph Meta Tags Generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await ProductController.getById(params.id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Eleven Essentials`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      url: `http://localhost:3000/shop/${product.id}`,
      siteName: 'Eleven Essentials',
      images: product.images?.length > 0 ? [{ url: product.images[0], width: 800, height: 800 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images?.length > 0 ? [product.images[0]] : [],
    },
  };
}


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productRaw = await ProductController.getById(params.id);
  if (!productRaw) return notFound();

  // Normalize Prisma format to required UI structure
  const product = {
    ...productRaw,
    mrp: productRaw.variants?.[0]?.originalPrice || productRaw.variants?.[0]?.price || 0,
    category: productRaw.category?.name || "Premium Collection"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Task 17: Fire Meta Pixel ViewContent event */}
      <Script id="meta-pixel-viewcontent" strategy="afterInteractive">
        {`
          if (typeof fbq === 'function') {
            fbq('track', 'ViewContent', {
              content_ids: ['${product.id}'],
              content_name: '${product.name}',
              content_type: 'product',
              value: ${product.variants?.[0]?.price || 0},
              currency: 'INR'
            });
          }
        `}
      </Script>

      {/* Breadcrumb Area */}
      <div className="bg-navy-50 py-4 px-4 sm:px-8 border-b border-navy-100">
         <div className="max-w-7xl mx-auto flex items-center text-sm font-semibold text-navy-400 gap-2">
            <span>Home</span>
            <span>/</span>
            <span>Shop</span>
            <span>/</span>
            <span className="text-navy-900">{product.name}</span>
         </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div className="w-full lg:w-[55%] shrink-0">
             <ProductGallery images={product.images || []} videos={product.videos || []} />
          </div>

          {/* Right: Info */}
          <div className="w-full lg:flex-1">
             <ProductInfo product={product as any} />
          </div>
        </div>
      </div>
    
      {/* Q&A and Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-navy-50">
        <ProductQA />
        <ProductReviews reviews={product.reviews || []} />
      </div>
    </div>
  );
}
