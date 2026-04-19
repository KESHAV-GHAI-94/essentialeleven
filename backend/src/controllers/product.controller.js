import { ProductService } from "../services/product.service.js";

export class ProductController {
  static async listFeaturedProducts() {
    const products = await ProductService.getAll();
    return products.slice(0, 4);
  }

  static async listAll() {
    return await ProductService.getAll();
  }

  static async getById(id) {
    return await ProductService.getById(id);
  }
}
