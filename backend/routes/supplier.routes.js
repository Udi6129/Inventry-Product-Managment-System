import express from 'express';
import { addSupplier, deleteSupplier, getSupplier, updateSupplier } from '../controllers/Supplier.controller.js';

const router = express.Router();

router.post("/add", addSupplier);
router.get("/all", getSupplier);
router.put("/update/:id", updateSupplier);
router.delete("/delete/:id", deleteSupplier);

export default router;
