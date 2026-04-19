import { Router } from "express";
import { AddressController } from "../controllers/address.controller.js";

const router = Router();

router.get("/user/:userId", AddressController.getUserAddresses);
router.post("/", AddressController.addAddress);
router.delete("/:id", AddressController.deleteAddress);

export default router;
