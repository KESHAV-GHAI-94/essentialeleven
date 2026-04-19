import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";

const router = Router();

router.get("/:userId", CartController.getCart);
router.post("/sync", CartController.syncCart);

export default router;
