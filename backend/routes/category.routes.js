import express from "express";
import {
  addCategory, getCategory,updateCategory,deleteCategory
  
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/add", addCategory);
router.get("/all", getCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
