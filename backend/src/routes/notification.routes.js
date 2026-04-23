import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";

const router = Router();

router.get("/admin", async (req, res) => {
  try {
    const notifications = await NotificationController.listAdminNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await NotificationController.markAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

router.post("/mark-all-read", async (req, res) => {
  try {
    await NotificationController.markAllAsRead();
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

export default router;
