import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { prisma } from "../utils/prisma.js";

const router = Router();

// POST /api/users/sync-viewed
// Body: { userId: string, productIds: string[] }
router.post("/sync-viewed", async (req, res) => {
  try {
    const { userId, productIds } = req.body;
    if (!userId || !Array.isArray(productIds)) {
      return res.status(400).json({ error: "userId and productIds[] are required" });
    }
    await UserController.syncViewed(userId, productIds);
    res.json({ success: true });
  } catch (err) {
    console.error("[POST /users/sync-viewed]", err);
    res.status(500).json({ error: "Failed to sync history" });
  }
});

// POST /api/users/signup
router.post("/signup", UserController.signup);

// POST /api/users/login
router.post("/login", UserController.login);

// POST /api/users/google
router.post("/google", UserController.googleAuth);

// POST /api/users/request-otp
router.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    const result = await UserController.requestOTP(phone);
    res.json(result);
  } catch (err) {
    console.error("[POST /users/request-otp]", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// GET /api/users/settings/notifications
router.get("/settings/notifications/:userId", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { notificationSettings: true }
    });
    res.json(user?.notificationSettings || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// GET /api/users/:userId/profile
router.get("/:userId/profile", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: { addresses: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PATCH /api/users/:userId/profile
router.patch("/:userId/profile", UserController.updateProfile);

// PATCH /api/users/:userId/addresses/:addressId/default
router.patch("/:userId/addresses/:addressId/default", async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // Unset current default
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    // Set new default
    const address = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    res.json(address);
  } catch (err) {
    res.status(500).json({ error: "Failed to set default address" });
  }
});

// POST /api/users/:userId/addresses
router.post("/:userId/addresses", async (req, res) => {
  try {
    const { street, recipientName, phoneNumber, city, state, country, zipCode, isDefault } = req.body;

    // If setting a new default, unset others first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.params.userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.params.userId,
        street, recipientName, phoneNumber, city, state, country, zipCode, isDefault: !!isDefault
      }
    });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: "Failed to create address" });
  }
});

// DELETE /api/users/addresses/:addressId
router.delete("/addresses/:addressId", async (req, res) => {
  try {
    await prisma.address.delete({
      where: { id: req.params.addressId }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// PATCH /api/users/addresses/:addressId
router.patch("/addresses/:addressId", async (req, res) => {
  try {
    const { street, recipientName, phoneNumber, city, state, country, zipCode, isDefault } = req.body;

    // If setting as default, unset others
    if (isDefault) {
      const addr = await prisma.address.findUnique({ where: { id: req.params.addressId } });
      if (addr) {
        await prisma.address.updateMany({
          where: { userId: addr.userId },
          data: { isDefault: false }
        });
      }
    }

    const address = await prisma.address.update({
      where: { id: req.params.addressId },
      data: { street, recipientName, phoneNumber, city, state, country, zipCode, isDefault: !!isDefault }
    });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// PATCH /api/users/settings/notifications
router.patch("/settings/notifications", async (req, res) => {
  try {
    const { userId, settings } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { notificationSettings: settings }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// POST /api/users/request-password-otp
router.post("/request-password-otp", UserController.requestPasswordOTP);

export default router;
