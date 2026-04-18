import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.NEXTAUTH_URL || "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

export default app;
