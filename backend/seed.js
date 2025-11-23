import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import ConnectDB from "./config/db.js";
import userModel from "./Modals/user.modal.js";



const register = async () => {
  try {
    await ConnectDB();

    const hashedPassword = await bcrypt.hash("admin", 10);

    

    const newUser = new userModel({
      name: "Admin",
      email: "admin1@gmail.com",
      password: hashedPassword,
      address: "Admin Address",
      role: "admin",
    });

    await newUser.save();
    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.log("❌ Error creating admin user:", error.message);
  }
};

register();
