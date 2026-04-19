import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.NEXTAUTH_URL || "http://localhost:3000" }));

// Webhook needs to be before express.json if we want raw body, 
// but here we just registered it as a router. 
// For production, suggest using a dedicated raw middleware for this route.
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

export default app;
