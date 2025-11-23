import { useState, useContext } from "react";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { serverUrl } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // <-- for navigation
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, formData);

      if (res.data.success) {
        const { user, token } = res.data.data;
        login(user, token);
        if (user?._id) {
          localStorage.setItem("userId", user._id);
        }
        alert("Login Successful!");
        const redirectPath = user?.role === "customer" ? "/customer-dashboard" : "/admin-dashboard";
        navigate(redirectPath);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid Email or Password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
