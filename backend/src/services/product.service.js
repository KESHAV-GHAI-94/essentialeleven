import { prisma } from "../utils/prisma.js";
import { redis } from "../utils/redis.js";

export class ProductService {
  static async getAll() {
    const cacheKey = "all_products_v_fresh_02";
    
    // 1. Try to get from Redis
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error("Cache Read Error:", e);
    }

    // 2. Fetch from DB
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { 
        category: true,
        variants: true
      }
    });

    // 3. Save to Redis (Cache for 1 hour)
    try {
      await redis.set(cacheKey, JSON.stringify(products), "EX", 3600);
    } catch (e) {
      console.error("Cache Write Error:", e);
    }

    return products;
  }

  static async getById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: { variants: true, reviews: true }
    });
  }
}
