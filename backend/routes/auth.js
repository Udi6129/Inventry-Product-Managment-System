// routes/auth.js
import login from '../controllers/controller.js'; // no braces
import express from 'express';
const router = express.Router();

router.post('/login', login);
 
export default router;
