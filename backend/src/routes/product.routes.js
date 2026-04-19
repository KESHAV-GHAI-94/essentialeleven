import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await ProductController.listAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const products = await ProductController.listFeaturedProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await ProductController.getById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
