import express from 'express';
import { addProduct, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/all", getProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
