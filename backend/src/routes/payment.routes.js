import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../utils/prisma.js";
import { MailService } from "../services/mail.service.js";
import { WhatsAppService } from "../services/whatsapp.service.js";

const router = Router();

// Configure Razorpay (using placeholders for now)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// 1. Create Order
router.post("/create-order", async (req, res) => {
  const { amount, userId, items, email, receipt } = req.body;

  try {
    // A. Create Razorpay Order
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    };
    const rzpOrder = await razorpay.orders.create(options);

    // B. Handle User (Guest or Logged In)
    let finalUserId = userId;
    if (!finalUserId && email) {
       const user = await prisma.user.upsert({
         where: { email },
         update: {},
         create: { email, name: "Guest Customer" }
       });
       finalUserId = user.id;
    }

    // C. Create Pending Order in Database
    await prisma.order.create({
      data: {
        id: rzpOrder.id,
        userId: finalUserId || "cln_guest_fallback", // Provide a fallback or ensure one is created
        totalAmount: amount,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: items.map((item) => ({
             variantId: item.id.includes('-') ? item.id.split('-')[1] : item.id,
             quantity: item.quantity,
             price: item.price
          }))
        }
      }
    });

    res.json(rzpOrder);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 2. Verify Payment
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // 1. Update Order in DB
    const updatedOrder = await prisma.order.update({
       where: { id: razorpay_order_id },
       data: {
         status: "PROCESSING",
         paymentStatus: "PAID",
         paymentId: razorpay_payment_id
       },
       include: { user: true, items: { include: { variant: { include: { product: true } } } } }
    });

    // 2. Fire Notifications
    const orderData = {
       id: updatedOrder.id,
       customerName: updatedOrder.user?.name || "Customer",
       total: updatedOrder.totalAmount,
       items: updatedOrder.items.map(i => ({ name: i.variant?.product?.name, quantity: i.quantity, price: i.price })) 
    };

    MailService.sendOrderConfirmation(updatedOrder.user?.email || "user@example.com", orderData);
    WhatsAppService.sendOrderMessage(updatedOrder.phone || "91XXXXXXXXXX", updatedOrder.id, updatedOrder.totalAmount);

    res.json({ message: "Payment verified successfully", success: true });
  } else {
    res.status(400).json({ error: "Invalid signature", success: false });
  }
});

export default router;
