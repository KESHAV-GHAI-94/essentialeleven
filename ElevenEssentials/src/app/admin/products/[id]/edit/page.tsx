import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { ProductController } from "../../../../../../../backend/src/controllers/product.controller.js";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await ProductController.getById(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="w-full h-full">
      <AdminProductForm product={product} />
    </div>
  );
}
