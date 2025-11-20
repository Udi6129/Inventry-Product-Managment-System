import Product from "../Modals/product.modal.js";

// ==========================
// ADD PRODUCT
// ==========================
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, supplierId } = req.body;

    if (!name) {
      return res.status(400).json({ status: false, message: "Product name is required" });
    }

    if (!categoryId || !supplierId) {
      return res.status(400).json({ status: false, message: "Category & Supplier required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId,
    });

    await newProduct.save();

    return res.status(201).json({
      status: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ==========================
// GET ALL PRODUCTS
// ==========================
export const getProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .populate("supplierId", "name");

    return res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// UPDATE PRODUCT
// ==========================
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// DELETE PRODUCT
// ==========================
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
