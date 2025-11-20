import Category from "../Modals/category.modal.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    // Create new category
    const newCat = await Category.create({ name, description });

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCat,
    });
  } catch (error) {
    console.log("Add Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const getCategory=async(req,res)=>{
      try {
    const category = await Category.find();
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Category updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteCategory=async(req,res)=>{
    try {
         const id = req.params.id;
           const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.log("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while deleting category",
    });
  }
};