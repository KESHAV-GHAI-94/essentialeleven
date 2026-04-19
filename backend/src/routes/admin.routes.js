import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";

const router = Router();

router.get("/stats", AdminController.getStats);
router.get("/sales-report", AdminController.getSalesReport);
router.get("/recent-orders", AdminController.getRecentOrders);
router.get("/orders", AdminController.getAllOrders);
router.get("/orders/:id", AdminController.getOrderDetails);
router.post("/orders/:id/status", AdminController.updateOrderStatus);
router.get("/products", AdminController.getAllProducts);
router.post("/products", AdminController.createProduct);
router.post("/products/:id", AdminController.updateProduct);
router.get("/customers", AdminController.getAllCustomers);
router.get("/customers/:id", AdminController.getCustomerDetails);
router.get("/inventory", AdminController.getInventory);
router.post("/inventory/:id/stock", AdminController.updateStock);
router.get("/categories", AdminController.getAllCategories);
router.post("/categories", AdminController.createCategory);
router.get("/coupons", AdminController.getAllCoupons);
router.post("/coupons", AdminController.createCoupon);
router.get("/vendors", AdminController.getAllVendors);
router.post("/vendors/:id/status", AdminController.updateVendorStatus);

export default router;
