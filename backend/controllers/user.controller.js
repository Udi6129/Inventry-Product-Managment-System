import User from "../Modals/user.modal.js";
import bcrypt from "bcrypt";

export const addUser = async (req, res) => {
  try {
    const { name, email, password,phone, address, role } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email and password are required" });
    }

    // 2️⃣ Check if email already exists
    const exUser = await User.findOne({ email });
    if (exUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || "customer", // default role if not passed
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// =======================================
// GET ALL USERS
// =======================================
export const getUser = async (req, res) => {
  try {
    const users = await User.find();  // ✔ Correct Model Name
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =======================================
// DELETE USER
// =======================================
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await User.findByIdAndDelete(id);   // <-- FIX

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};
