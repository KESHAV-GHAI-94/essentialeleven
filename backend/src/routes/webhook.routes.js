import { Router } from "express";
import crypto from "crypto";
import { prisma } from "../utils/prisma.js";

const router = Router();

router.post("/razorpay", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
  const signature = req.headers["x-razorpay-signature"];

  // Note: Webhook verification usually requires the raw body string
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    const event = req.body.event;

    if (event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        const orderId = payment.order_id;
        
        console.log(`Payment Captured for Order: ${orderId}`);
        
        // Update Order status in DB here
        // await prisma.order.updateMany({ where: { paymentId: orderId }, data: { status: 'PAID' } });
    }
    
    res.json({ status: "ok" });
  } else {
    res.status(400).send("Invalid signature");
  }
});

export default router;
