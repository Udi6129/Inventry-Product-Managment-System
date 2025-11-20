import React, { useEffect, useState } from "react";
import axios from "axios";

export default function User() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openPanel, setOpenPanel] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "customer",
    password: "",
  });

  // ==========================
  // FETCH USERS
  // ==========================
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/all");
      setUsers(res.data.data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ==========================
  // ADD USER
  // ==========================
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/add-user",
        user
      );

      if (res.data.success) {
        alert("User Added Successfully!");

        setUser({
          name: "",
          email: "",
          phone: "",
          address: "",
          role: "customer",
          password: "",
        });

        setOpenPanel(false);
        fetchUser();
      }
    } catch (error) {
      console.log("Add Error:", error);
      alert("Error while adding user");
    }
  };

  // ==========================
  // DELETE USER
  // ==========================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/user/delete-user/${id}`
      );

      if (res.data.success) {
        alert("User Deleted Successfully!");
        fetchUser();
      }
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Error while deleting user");
    }
  };

  return (
    <div className="p-6 relative flex flex-col lg:flex-row gap-6">
      {/* LEFT TABLE */}
      <div className="flex-1 bg-white p-5 rounded-xl shadow-md">
        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <input
            type="text"
            placeholder="Search User..."
            className="border px-3 py-2 rounded-lg w-full sm:w-1/2 focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              setUser({
                name: "",
                email: "",
                phone: "",
                address: "",
                role: "customer",
                password: "",
              });
              setOpenPanel(true);
            }}
          >
            + Add User
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
                
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((usr) =>
                  usr.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((usr, index) => (
                  <tr key={usr._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{usr.name}</td>
                    <td className="px-4 py-2">{usr.email}</td>
                   
                    <td className="px-4 py-2">{usr.address}</td>
                    <td className="px-4 py-2 capitalize">{usr.role}</td>

                    <td className="px-4 py-2 space-x-3">
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDeleteUser(usr._id)}
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

      {/* RIGHT SLIDE PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl rounded-l-xl p-6 z-50
          transform transition-all duration-300
          ${openPanel ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Add User</h2>
          <button
            className="text-gray-600 text-xl hover:text-red-600"
            onClick={() => setOpenPanel(false)}
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleAddUser} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

           

          <textarea
            placeholder="Address"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 h-24"
          ></textarea>

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <select
            className="w-full border rounded-lg px-3 py-2"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
          >
            Save User
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
