import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { parsePhoneNumber } from "../utils/phone.js";

const router = Router();

// GET /api/settings/store
router.get("/store", async (req, res) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "global_settings" }
    });
    
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "global_settings" }
      });
    }
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch store settings" });
  }
});

// PATCH /api/settings/store
router.patch("/store", async (req, res) => {
  try {
    // Explicitly pick all known StoreSettings fields — avoids Prisma rejecting unknown keys
    const {
      storeName, storeEmail, currency, currencySymbol,
      maintenanceMode, lowStockThreshold, showOutOfStock, socialLinks,
      // Communication fields
      senderEmail, senderName, senderPhone, whatsappNumber, supportPhone,
      smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure,
      // Notification toggles
      notifyOrderEmail, notifyOrderWhatsapp,
      notifyShippedEmail, notifyShippedWhatsapp,
      notifyLowStockEmail, notifyNewUserEmail
    } = req.body;

    const updateData = Object.fromEntries(
      Object.entries({
        storeName, storeEmail, currency, currencySymbol,
        maintenanceMode, lowStockThreshold, showOutOfStock, socialLinks,
        senderEmail, senderName, 
        senderPhone: parsePhoneNumber(senderPhone),
        whatsappNumber: parsePhoneNumber(whatsappNumber),
        supportPhone: parsePhoneNumber(supportPhone),
        smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure,
        notifyOrderEmail, notifyOrderWhatsapp,
        notifyShippedEmail, notifyShippedWhatsapp,
        notifyLowStockEmail, notifyNewUserEmail
      }).filter(([, v]) => v !== undefined)
    );

    const settings = await prisma.storeSettings.upsert({
      where: { id: "global_settings" },
      update: updateData,
      create: { id: "global_settings", ...updateData }
    });
    res.json(settings);
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Failed to update store settings", detail: err.message });
  }
});

// GET /api/settings/footer - Public links
router.get("/footer", async (req, res) => {
  try {
    const links = await prisma.footerLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch footer links" });
  }
});

// GET /api/settings/admin/footer - All links for admin
router.get("/admin/footer", async (req, res) => {
  try {
    const links = await prisma.footerLink.findMany({
      orderBy: [
        { group: "asc" },
        { order: "asc" }
      ]
    });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin footer links" });
  }
});

// POST /api/settings/footer
router.post("/footer", async (req, res) => {
  try {
    const { label, url, group, order, isActive } = req.body;
    const link = await prisma.footerLink.create({
      data: { label, url, group, order: parseInt(order) || 0, isActive: isActive !== false }
    });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Failed to create footer link" });
  }
});

// PATCH /api/settings/footer/:id
router.patch("/footer/:id", async (req, res) => {
  try {
    const { label, url, group, order, isActive } = req.body;
    const link = await prisma.footerLink.update({
      where: { id: req.params.id },
      data: { label, url, group, order: parseInt(order) || 0, isActive }
    });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Failed to update footer link" });
  }
});

// DELETE /api/settings/footer/:id
router.delete("/footer/:id", async (req, res) => {
  try {
    await prisma.footerLink.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete footer link" });
  }
});

export default router;
