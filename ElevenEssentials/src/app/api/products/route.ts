import { NextResponse } from "next/server";
import { ProductController } from "../../../../../backend/src/controllers/product.controller.js";

export async function GET() {
  try {
    const products = await ProductController.listAll();
    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
