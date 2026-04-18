import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

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

export default router;
