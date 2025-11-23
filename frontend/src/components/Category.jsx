import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../context/AuthContext";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [openPanel, setOpenPanel] = useState(false);

  const [category, setCategory] = useState({ name: "", description: "" });
  const [isEdit, setIsEdit] = useState(false);

  // MISSING STATE → YOU DIDN'T CREATE IT
  const [editCategory, setEditCategory] = useState({
    _id: "",
    name: "",
    description: "",
  });

  // ==========================
  // FETCH ALL CATEGORIES
  // ==========================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/category/all`);
      setCategories(res.data.data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================
  // ADD CATEGORY
  // ==========================
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/api/category/add`, category);
      if (res.data.success) {
        alert("Category Added Successfully!");
        setCategory({ name: "", description: "" });
        setOpenPanel(false);
        fetchCategories();
      }
    } catch (error) {
      console.log("Add Error:", error);
      alert("Error while adding category");
    }
  };

  // ==========================
  // EDIT BUTTON → OPEN PANEL
  // ==========================
  const handleEditOpen = (cat) => {
    setIsEdit(true);
    setEditCategory({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
    });
    setOpenPanel(true);
  };

  // ==========================
  // UPDATE CATEGORY
  // ==========================
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${serverUrl}/api/category/update/${editCategory._id}`,
        editCategory
      );

      if (res.data.success) {
        alert("Category Updated Successfully!");
        setOpenPanel(false);
        setIsEdit(false);
        fetchCategories();
      }
    } catch (error) {
      console.log("Update Error:", error);
      alert("Error while updating category");
    }
  };
// ==========================
// DELETE CATEGORY
// ==========================
const handleDeleteCategory = async (id) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    const res = await axios.delete(`${serverUrl}/api/category/delete/${id}`);

    if (res.data.success) {
      alert("Category Deleted Successfully!");
      fetchCategories();
    }
  } catch (error) {
    console.log("Delete Error:", error);
    alert("Error while deleting category");
  }
};






  return (
    <div className="p-6 relative flex flex-col lg:flex-row gap-6">

      {/* ================= LEFT SIDE - TABLE ================= */}
      <div className="flex-1 bg-white p-5 rounded-xl shadow-md">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <input
            type="text"
            placeholder="Search category..."
            className="border px-3 py-2 rounded-lg w-full sm:w-1/2 focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              setIsEdit(false);
              setCategory({ name: "", description: "" });
              setOpenPanel(true);
            }}
          >
            + Add New
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Category Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {categories
                .filter((cat) =>
                  cat.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((cat, index) => (
                  <tr key={cat._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{cat.name}</td>
                    <td className="px-4 py-2">{cat.description || "-"}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEditOpen(cat)}
                      >
                        Edit
                      </button>
                     <button
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  onClick={() => handleDeleteCategory(cat._id)}
>
  Delete
</button>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RIGHT SLIDE PANEL ================= */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl rounded-l-xl p-6 z-50
          transform transition-all duration-300
          ${openPanel ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button
            className="text-gray-600 text-xl hover:text-red-600"
            onClick={() => setOpenPanel(false)}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={isEdit ? handleUpdateCategory : handleAddCategory}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={isEdit ? editCategory.name : category.name}
            onChange={(e) =>
              isEdit
                ? setEditCategory({ ...editCategory, name: e.target.value })
                : setCategory({ ...category, name: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />

          <textarea
            placeholder="Description"
            value={isEdit ? editCategory.description : category.description}
            onChange={(e) =>
              isEdit
                ? setEditCategory({
                    ...editCategory,
                    description: e.target.value,
                  })
                : setCategory({
                    ...category,
                    description: e.target.value,
                  })
            }
            className="w-full border rounded-lg px-3 py-2 h-24 focus:ring focus:ring-blue-200"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isEdit ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>

      {/* ===== Mobile Backdrop ===== */}
      {openPanel && (
        <div
          onClick={() => setOpenPanel(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm sm:hidden"
        ></div>
      )}
    </div>
  );
}
