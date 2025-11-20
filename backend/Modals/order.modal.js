import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String },       // optional now
  address: { type: String }, 
    productName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
