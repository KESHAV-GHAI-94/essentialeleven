import { Router } from "express";
import { prisma } from "../utils/prisma.js";

const router = Router();

// GET /api/coupons/validate?code=XYZ
router.get("/validate", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toString().toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: "This coupon is no longer active" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: "This coupon has expired" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ error: "This coupon has reached its usage limit" });
    }

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: "Validation failed" });
  }
});

export default router;
