import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../utils/prisma.js";
import { MailService } from "../services/mail.service.js";
import { WhatsAppService } from "../services/whatsapp.service.js";
import { parsePhoneNumber } from "../utils/phone.js";
import { NotificationController } from "../controllers/notification.controller.js";

const router = Router();

// Configure Razorpay (using placeholders for now)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// 1. Create Order
router.post("/create-order", async (req, res) => {
  const { amount, userId, items, email, phone, address, city, pincode, receipt } = req.body;

  // Validation
  if (phone && phone.replace(/\D/g, '').length !== 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
  }

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

    // Extract parsed items
    const parsedItems = items.map((item) => {
      const vId = item.id.includes('-') ? item.id.split('-')[1] : item.id;
      return {
        variantId: vId,
        quantity: item.quantity,
        price: item.price
      };
    });

    // Filter out variants that no longer exist in DB (prevents Prisma P2003 Foreign Key constraint violations)
    const existingVariants = await prisma.variant.findMany({
      where: { id: { in: parsedItems.map(i => i.variantId) } },
      select: { id: true }
    });

    const validVariantIds = new Set(existingVariants.map(v => v.id));
    const validOrderItems = parsedItems.filter(item => validVariantIds.has(item.variantId));

    if (validOrderItems.length === 0) {
      return res.status(400).json({ error: "All items in cart are invalid or out of stock." });
    }

    // C. Create Pending Order in Database
    await prisma.order.create({
      data: {
        id: rzpOrder.id,
        userId: finalUserId || "cln_guest_fallback", // Provide a fallback or ensure one is created
        totalAmount: amount,
        address,
        city,
        pincode,
        phone: parsePhoneNumber(phone),
        email,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: validOrderItems
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

    // 3. Respond immediately to the frontend
    res.json({ message: "Payment verified successfully", success: true });

    // 4. Run background tasks (Notifications & Inventory)
    (async () => {
      try {
        // Fire Notifications
        const orderData = {
          id: updatedOrder.id,
          customerName: updatedOrder.user?.name || "Customer",
          total: updatedOrder.totalAmount,
          address: updatedOrder.address,
          city: updatedOrder.city,
          pincode: updatedOrder.pincode,
          phone: updatedOrder.phone,
          email: updatedOrder.email || updatedOrder.user?.email,
          items: updatedOrder.items.map(i => ({ name: i.variant?.product?.name, quantity: i.quantity, price: i.price }))
        };

        try {
          console.log("DEBUG: Background: Sending Order Confirmation Email");
          await MailService.sendOrderConfirmation(updatedOrder.email || updatedOrder.user?.email || "user@example.com", orderData);
          
          if (updatedOrder.phone) {
            console.log("DEBUG: Background: Sending WhatsApp Notification");
            await WhatsAppService.sendOrderMessage(updatedOrder.phone, updatedOrder.id.slice(-8).toUpperCase(), updatedOrder.totalAmount);
          }
          
          // Check if it's a NEW Customer
          const customerOrdersCount = await prisma.order.count({
            where: { 
              OR: [{ userId: updatedOrder.userId }, { email: updatedOrder.email }],
              paymentStatus: "PAID"
            }
          });

          const isNewCustomer = customerOrdersCount <= 1;
          
          await NotificationController.create({
            message: isNewCustomer 
              ? `🎉 NEW Customer! First Order #${updatedOrder.id.slice(-8).toUpperCase()} received`
              : `New Order #${updatedOrder.id.slice(-8).toUpperCase()} received`,
            type: 'NEW_ORDER'
          });

          await MailService.sendAdminNotification(orderData);
        } catch (notifError) {
          console.error("CRITICAL: Background Notification Error:", notifError);
        }

        // Update Inventory & Trigger Alerts
        for (const item of updatedOrder.items) {
          if (item.variantId) {
            const updatedVariant = await prisma.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } }
            });

            if (updatedVariant.stock === 0) {
              await NotificationController.create({
                message: `OUT OF STOCK: ${updatedVariant.product?.name} has run out!`,
                type: 'OUT_OF_STOCK'
              });
            } else if (updatedVariant.stock > 0 && updatedVariant.stock <= 5) {
              await NotificationController.create({
                message: `LOW STOCK: Only ${updatedVariant.stock} units left for ${updatedVariant.product?.name}`,
                type: 'LOW_STOCK'
              });
            }
          }
        }
      } catch (bgError) {
        console.error("CRITICAL: Background Task Error:", bgError);
      }
    })();
  } else {
    res.status(400).json({ error: "Invalid signature", success: false });
  }
});

// 3. Get User Orders
router.get("/user/:userId", async (req, res) => {
  try {
    console.log("DEBUG: Fetching orders for userId:", req.params.userId);
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        }
      }
    });

    console.log(`DEBUG: Found ${orders.length} orders in DB for this user.`);

    const formattedOrders = orders.map(o => ({
      id: o.id,
      createdAt: o.createdAt,
      total: o.totalAmount,
      status: o.status,
      items: o.items.map(i => ({
        id: i.id,
        name: i.variant?.product?.name || "Unknown Product",
        price: i.price,
        quantity: i.quantity,
        image: i.variant?.images?.[0] || i.variant?.product?.images?.[0] || ""
      }))
    }));
    res.json(formattedOrders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 4. Get Single Order
router.get("/:orderId", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        },
        user: true
      }
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    const formattedOrder = {
      id: order.id,
      createdAt: order.createdAt,
      total: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      address: order.address,
      city: order.city,
      pincode: order.pincode,
      phone: order.phone,
      email: order.email,
      items: order.items.map(i => ({
        id: i.id,
        name: i.variant?.product?.name || "Unknown Product",
        price: i.price,
        quantity: i.quantity,
        image: i.variant?.images?.[0] || i.variant?.product?.images?.[0] || ""
      }))
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error("Fetch Order Error:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

export default router;
