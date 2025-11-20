import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // fixed typo
      trim: true // optional, helps remove extra whitespace
    },
    email: {
      type: String,
      required: true, // fixed typo
      unique: true, // ensures no duplicate emails in collection
      lowercase: true, // optional, stores emails in lowercase
      trim: true // optional
    },
    phone: {
      type: String,
      required: false 
    },
    address: {
      type: String,
      required: false 
    }
  }
);

export default mongoose.model("Supplier", SupplierSchema);
