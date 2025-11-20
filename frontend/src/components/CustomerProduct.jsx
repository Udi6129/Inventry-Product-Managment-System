import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function CustomerProduct() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/product/all");
      setProducts(res.data.data);
    } catch (error) {
      console.error("Fetch Product Error:", error);
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category/all");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "" || p.categoryId?._id === filterCategory)
  );

  // OPEN MODAL
  const handleOrder = (product) => {
    if ((product.stock ?? 0) <= 0) return;
    setSelectedProduct(product);
    setQuantity(1);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // PLACE ORDER
  const placeOrder = async () => {
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    const available = selectedProduct?.stock ?? 0;
    if (quantity > available) {
      alert(`Only ${available} units available.`);
      return;
    }

    try {
      const payload = {
        name: user?.name,
        address: user?.address,
        productName: selectedProduct.name,
        category:
          selectedProduct.categoryId?.name ||
          selectedProduct.categoryId?.title ||
          selectedProduct.category ||
          "General",
        quantity,
        totalPrice: selectedProduct.price * quantity,
        date: new Date().toISOString(),
      };

      await axios.post("http://localhost:8000/api/order/create", payload);
      alert("Order Placed Successfully!");
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Order Error:", error);
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Order Failed!");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Search + Category Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between mb-5 gap-3">
        <input
          type="text"
          placeholder="Search product..."
          className="border px-3 py-2 rounded-lg w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded-lg w-full sm:w-1/3"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Order</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">{p.categoryId?.name || "-"}</td>
                <td className="px-4 py-2">₹{p.price}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">
                  <button
                    className={`px-3 py-1 rounded text-white ${p.stock > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={() => handleOrder(p)}
                    disabled={p.stock <= 0}
                  >
                    {p.stock > 0 ? "Order" : "Out of Stock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER MODAL */}
      {isModalOpen && selectedProduct && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 w-80 rounded-xl shadow-xl border animate-fadeIn">
            <h2 className="text-xl font-semibold mb-2">Order Product</h2>
            <p className="font-medium text-lg">{selectedProduct.name}</p>
            <p className="text-gray-600">Price: ₹{selectedProduct.price}</p>
            <p className="text-sm text-gray-500 mb-4">
              Available: {selectedProduct.stock} units
            </p>

            {/* Quantity */}
            <label className="font-medium block mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(
                    1,
                    Math.min(Number(e.target.value), selectedProduct.stock)
                  )
                )
              }
              className="border rounded px-3 py-2 w-full"
            />

            {/* Total Price */}
            <p className="mt-4 text-lg font-semibold">
              Total: ₹{selectedProduct.price * quantity}
            </p>

            {errorMessage && (
              <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-3 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={selectedProduct.stock <= 0}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
