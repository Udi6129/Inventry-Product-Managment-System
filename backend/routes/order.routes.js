import express from "express";
import { createOrder, getOrders, getUserOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all", getOrders);

// ⭐ ADD THIS
router.get("/user-orders/:userId", getUserOrders);

export default router;
