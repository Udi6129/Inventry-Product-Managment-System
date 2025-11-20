
import Supplier from "../Modals/Supplier.modal.js";
export const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const existing = await Supplier.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const newSup = await Supplier.create({ name, email, phone, address });
    return res.status(201).json({ success: true, message: "Supplier added successfully", data: newSup });
  } catch (error) {
    console.log("Add Supplier Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const getSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, message: "Supplier updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const id = req.params.id;
    await Supplier.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
