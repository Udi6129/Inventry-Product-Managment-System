import express from 'express';

 import { addUser,deleteUser, getUser } from '../controllers/user.controller.js';
const router = express.Router();
router.post("/add-user", addUser);
router.get("/all", getUser);
router.delete("/delete-user/:id", deleteUser);

export default router;