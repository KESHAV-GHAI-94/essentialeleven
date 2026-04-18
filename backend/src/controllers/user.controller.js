import { UserService } from "../services/user.service.js";
import { SmsService } from "../services/sms.service.js";
import { redis } from "../utils/redis.js";
import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserController {
  /**
   * Generates and sends an OTP to the user's phone
   */
  static async requestOTP(phone) {
    const otp = await SmsService.sendOTP(phone);
    
    // Store in Redis with 5-minute expiry
    await redis.set(`otp:${phone}`, otp, "EX", 300);
    
    return { success: true, message: "OTP sent successfully" };
  }

  /**
   * Verifies the OTP and returns the user
   */
  static async verifyOTP(phone, code) {
    const storedOtp = await redis.get(`otp:${phone}`);
    
    if (!storedOtp || storedOtp !== code) {
      throw new Error("Invalid or expired OTP");
    }

    // Clear OTP after success
    await redis.del(`otp:${phone}`);

    // Fetch/Create user and return
    return await UserService.findOrCreateUserByPhone(phone);
  }

  /**
   * Handles the authentication logic for NextAuth authorize callback
   */
  static async handleAuth(credentials) {
    // 1. Check for email/pass (Legacy)
    if (credentials?.email && credentials?.password) {
       const user = await UserService.findByEmail(credentials.email);
       if (!user) throw new Error("User not found");
       
       const isMatch = await bcrypt.compare(credentials.password, user.password || "");
       if (!isMatch) throw new Error("Invalid password");
       
       return user;
    }

    // 2. Check for OTP session (Mobile)
    if (credentials?.phone && credentials?.otp) {
       return await this.verifyOTP(credentials.phone, credentials.otp);
    }

    throw new Error("Missing authentication criteria");
  }

  /**
   * Handles Google Authentication
   */
  static async googleAuth(req, res) {
    try {
      const { email, name, image } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required for Google Auth" });
      }

      const user = await UserService.findOrCreateUser(email);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });

      res.status(200).json({ user, token });
    } catch (err) {
      console.error("[POST /users/google]", err);
      res.status(500).json({ error: "Failed to authenticate with Google" });
    }
  }

  /**
   * Register a new user
   */
  static async signup(req, res) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserService.createUser({ email, password: hashedPassword, name });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });

      res.status(201).json({ user, token });
    } catch (err) {
      console.error("[POST /users/signup]", err);
      res.status(500).json({ error: "Failed to sign up" });
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await UserService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });

      res.status(200).json({ user, token });
    } catch (err) {
      console.error("[POST /users/login]", err);
      res.status(500).json({ error: "Failed to login" });
    }
  }

  /**
   * Syncs the user's viewed product history with the database.
   * Deduplicates and caps at 20 most-recent items.
   */
  static async syncViewed(userId, productIds) {
    if (!userId || !Array.isArray(productIds) || productIds.length === 0) return;

    // Fetch existing history first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { viewedHistory: true },
    });

    const existing = user?.viewedHistory || [];
    // Merge new IDs at the front, deduplicate, cap at 20
    const merged = [...new Set([...productIds, ...existing])].slice(0, 20);

    return await prisma.user.update({
      where: { id: userId },
      data: { viewedHistory: merged },
    });
  }
}
