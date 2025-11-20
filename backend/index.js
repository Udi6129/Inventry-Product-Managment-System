import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from './routes/user.routes.js';
import orderRoutes from "./routes/order.routes.js"
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes)
 // ✅ Mount category routes
app.use("/api/category", categoryRoutes);
app.use("/api/supplier",supplierRoutes);
// Start server
app.use("/api/product",productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order",orderRoutes);
app.listen(port, () => {
    ConnectDB()
  console.log(`✅ Server is running on port ${port}`);
});
