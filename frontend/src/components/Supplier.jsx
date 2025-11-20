import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [openPanel, setOpenPanel] = useState(false);

  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editSupplier, setEditSupplier] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // ==========================
  // FETCH ALL SUPPLIERS
  // ==========================
  const fetchSupplier = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/supplier/all");
      setSuppliers(res.data.data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

  // ==========================
  // ADD SUPPLIER
  // ==========================
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/supplier/add",
        supplier
      );

      if (res.data.success) {
        alert("Supplier Added Successfully!");
        setSupplier({ name: "", email: "", phone: "", address: "" });
        setOpenPanel(false);
        fetchSupplier();
      }
    } catch (error) {
      console.log("Add Error:", error);
      alert("Error while adding Supplier");
    }
  };

  // ==========================
  // OPEN EDIT PANEL
  // ==========================
  const handleEditOpen = (sup) => {
    setIsEdit(true);
    setEditSupplier({
      _id: sup._id,
      name: sup.name,
      email: sup.email,
      phone: sup.phone,
      address: sup.address,
    });
    setOpenPanel(true);
  };

  // ==========================
  // UPDATE SUPPLIER
  // ==========================
  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8000/api/supplier/update/${editSupplier._id}`,
        editSupplier
      );

      if (res.data.success) {
        alert("Supplier Updated Successfully!");
        setOpenPanel(false);
        setIsEdit(false);
        fetchSupplier();
      }
    } catch (error) {
      console.log("Update Error:", error);
      alert("Error while updating Supplier");
    }
  };

  // ==========================
  // DELETE SUPPLIER
  // ==========================
  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Supplier?"))
      return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/supplier/delete/${id}`
      );

      if (res.data.success) {
        alert("Supplier Deleted Successfully!");
        fetchSupplier();
      }
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Error while deleting Supplier");
    }
  };

  return (
    <div className="p-6 relative flex flex-col lg:flex-row gap-6">
      {/* LEFT SIDE TABLE */}
      <div className="flex-1 bg-white p-5 rounded-xl shadow-md">
        {/* Search + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <input
            type="text"
            placeholder="Search Supplier..."
            className="border px-3 py-2 rounded-lg w-full sm:w-1/2 focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              setIsEdit(false);
              setSupplier({ name: "", email: "", phone: "", address: "" });
              setOpenPanel(true);
            }}
          >
            + Add Supplier
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {suppliers
                .filter((sup) =>
                  sup.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((sup, index) => (
                  <tr key={sup._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{sup.name}</td>
                    <td className="px-4 py-2">{sup.email}</td>
                    <td className="px-4 py-2">{sup.phone}</td>
                    <td className="px-4 py-2">{sup.address}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEditOpen(sup)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDeleteSupplier(sup._id)}
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
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl rounded-l-xl p-6 z-50
        transform transition-all duration-300
        ${openPanel ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {isEdit ? "Edit Supplier" : "Add Supplier"}
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
          onSubmit={isEdit ? handleUpdateSupplier : handleAddSupplier}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Supplier Name"
            value={isEdit ? editSupplier.name : supplier.name}
            onChange={(e) =>
              isEdit
                ? setEditSupplier({ ...editSupplier, name: e.target.value })
                : setSupplier({ ...supplier, name: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={isEdit ? editSupplier.email : supplier.email}
            onChange={(e) =>
              isEdit
                ? setEditSupplier({ ...editSupplier, email: e.target.value })
                : setSupplier({ ...supplier, email: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Phone"
            value={isEdit ? editSupplier.phone : supplier.phone}
            onChange={(e) =>
              isEdit
                ? setEditSupplier({ ...editSupplier, phone: e.target.value })
                : setSupplier({ ...supplier, phone: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />

          <textarea
            placeholder="Address"
            value={isEdit ? editSupplier.address : supplier.address}
            onChange={(e) =>
              isEdit
                ? setEditSupplier({ ...editSupplier, address: e.target.value })
                : setSupplier({ ...supplier, address: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 h-24"
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
          >
            {isEdit ? "Update Supplier" : "Save Supplier"}
          </button>
        </form>
      </div>

      {/* Mobile Backdrop */}
      {openPanel && (
        <div
          onClick={() => setOpenPanel(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm sm:hidden"
        ></div>
      )}
    </div>
  );
}
