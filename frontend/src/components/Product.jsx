import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState("");
  const [openPanel, setOpenPanel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    supplierId: "",
  });

  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    supplierId: "",
  });

  // ==========================
  // FETCH PRODUCTS
  // ==========================
const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/product/all");
    console.log("Fetched products:", res.data.data);
    setProducts([...res.data.data]); // Create new array copy to force update
  } catch (error) {
    console.error("Product Fetch Error:", error);
  }
};


  // ==========================
  // FETCH CATEGORY + SUPPLIER
  // ==========================
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category/all");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Category Fetch Error:", error);
      alert("Failed to fetch categories");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/supplier/all");
      setSuppliers(res.data.data);
    } catch (error) {
      console.error("Supplier Fetch Error:", error);
      alert("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  // ==========================
  // INPUT VALIDATION
  // ==========================
  const isValidProduct = (prod) => {
    if (
      !prod.name.trim() ||
      (prod.price === "" || Number(prod.price) <= 0) ||
      (prod.stock === "" || Number(prod.stock) < 0) ||
      !prod.categoryId ||
      !prod.supplierId
    ) {
      alert(
        "Please fill all required fields.\nPrice should be > 0 and stock cannot be negative."
      );
      return false;
    }
    return true;
  };

  // ==========================
  // ADD PRODUCT
  // ==========================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!isValidProduct(product)) return; // Validation check

    try {
      const res = await axios.post("http://localhost:8000/api/product/add", product);

      if (res.data.success) {
        alert("Product Added Successfully!");

        setProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
          supplierId: "",
        });

        setOpenPanel(false);
        fetchProducts();
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      alert("Error while adding product");
    }
  };

  // ==========================
  // OPEN EDIT PANEL
  // ==========================
  const handleEditOpen = (prod) => {
    setIsEdit(true);

    setEditProduct({
      _id: prod._id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      categoryId: prod.categoryId?._id || "",
      supplierId: prod.supplierId?._id || "",
    });

    setOpenPanel(true);
  };

  // ==========================
  // UPDATE PRODUCT
  // ==========================
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!isValidProduct(editProduct)) return; // Validation check

    try {
      const res = await axios.put(
        `http://localhost:8000/api/product/update/${editProduct._id}`,
        editProduct
      );

      if (res.data.success) {
        alert("Product Updated Successfully!");
        setIsEdit(false);
        setOpenPanel(false);
        fetchProducts();
      }
    } catch (err) {
      console.error("Update Product Error:", err);
      alert("Update failed");
    }
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await axios.delete(`http://localhost:8000/api/product/delete/${id}`);

      if (res.data.success) {
        alert("Product Deleted!");
        fetchProducts();
      }
    } catch (err) {
      console.error("Delete Product Error:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-6 relative flex flex-col lg:flex-row gap-6">
      {/* LEFT TABLE */}
      <div className="flex-1 bg-white p-5 rounded-xl shadow-md">
        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row justify-between mb-5 gap-3">
          <input
            type="text"
            placeholder="Search product..."
            className="border px-3 py-2 rounded-lg w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setIsEdit(false);
              setProduct({
                name: "",
                description: "",
                price: "",
                stock: "",
                categoryId: "",
                supplierId: "",
              });
              setOpenPanel(true);
            }}
          >
            + Add Product
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Supplier</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {products
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((p, i) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2 font-medium">{p.name}</td>
                    <td className="px-4 py-2">{p.categoryId?.name || "-"}</td>
                    <td className="px-4 py-2">{p.supplierId?.name || "-"}</td>
                    <td className="px-4 py-2">₹{p.price}</td>
                    <td className="px-4 py-2">{p.stock}</td>

                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEditOpen(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteProduct(p._id)}
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

      {/* RIGHT PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl p-6 z-50 transition-all duration-300
          ${openPanel ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button className="text-xl" onClick={() => setOpenPanel(false)}>
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={isEdit ? handleUpdateProduct : handleAddProduct}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            value={isEdit ? editProduct.name : product.name}
            onChange={(e) =>
              isEdit
                ? setEditProduct({ ...editProduct, name: e.target.value })
                : setProduct({ ...product, name: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={isEdit ? editProduct.description : product.description}
            onChange={(e) =>
              isEdit
                ? setEditProduct({ ...editProduct, description: e.target.value })
                : setProduct({ ...product, description: e.target.value })
            }
          />

          {/* Category */}
          <select
            className="w-full border p-2 rounded"
            value={isEdit ? editProduct.categoryId : product.categoryId}
            onChange={(e) =>
              isEdit
                ? setEditProduct({ ...editProduct, categoryId: e.target.value })
                : setProduct({ ...product, categoryId: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Supplier */}
          <select
            className="w-full border p-2 rounded"
            value={isEdit ? editProduct.supplierId : product.supplierId}
            onChange={(e) =>
              isEdit
                ? setEditProduct({ ...editProduct, supplierId: e.target.value })
                : setProduct({ ...product, supplierId: e.target.value })
            }
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            className="w-full border p-2 rounded"
            value={isEdit ? editProduct.price : product.price}
            onChange={(e) =>
              isEdit
                ? setEditProduct({ ...editProduct, price: e.target.value })
                : setProduct({ ...product, price: e.target.value })
            }
            min="0"
            step="0.01"
            required
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full border p-2 rounded"
            value={isEdit ? editProduct.stock : product.stock}
            onChange={(e) =>
              isEdit
                ? setEditProduct({ ...editProduct, stock: e.target.value })
                : setProduct({ ...product, stock: e.target.value })
            }
            min="0"
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {openPanel && (
        <div
          className="fixed inset-0 bg-black/30 sm:hidden"
          onClick={() => setOpenPanel(false)}
        ></div>
      )}
    </div>
  );
}
