import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category/all");
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/order/all", {
        params: {
          search,
          category,
          date,
        },
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch on load + when filter changes
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [search, category, date]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search product..."
          className="border px-3 py-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Dropdown */}
        <select
          className="border px-3 py-2 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((c) => (
            <option value={c.name} key={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Date Picker */}
        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Total Price</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{o.productName}</td>
                <td className="px-4 py-2">{o.quantity}</td>
                <td className="px-4 py-2">₹{o.totalPrice}</td>
                <td className="px-4 py-2">
                  {o.date ? o.date.slice(0, 10) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
