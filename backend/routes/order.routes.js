import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);  // This must exist
router.get("/all", getOrders);

export default router;
