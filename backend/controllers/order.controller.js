import Order from "../Modals/order.modal.js"; // Correct path

import Product from "../Modals/product.modal.js"; // Agar stock update karna ho

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { name, address, productName, category, quantity, totalPrice, date } = req.body;

    if (!productName || !category || !quantity || !totalPrice) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available`,
      });
    }

    const order = await Order.create({
      name,
      address,
      productName,
      category,
      quantity,
      totalPrice,
      date,
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json({ success: true, order, remainingStock: product.stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET ORDERS WITH FILTERS
export const getOrders = async (req, res) => {
  try {
    const { search = "", category = "", date = "" } = req.query;

    let filter = {};

    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
