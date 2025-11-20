/* eslint-disable react/prop-types */
import {
  MdDashboard,
  MdShoppingCart,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { FaBoxOpen, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const fallbackAvatar = "https://randomuser.me/api/portraits/women/65.jpg";

export default function Sidebar({ isOpen, isMobile, onLogout, onItemSelect }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const displayName = user?.name || user?.fullName || user?.username || "Customer";
  const roleLabel = user?.role ? user.role : "customer";

  const menuItem =
    "flex items-center gap-3 p-2 rounded-md cursor-pointer text-gray-600 hover:bg-purple-50 transition-all duration-200";
  const handleNavigation = (path) => {
    navigate(path);
    if (typeof onItemSelect === "function") {
      onItemSelect();
    }
  };

  return (
    <aside
      className={`bg-white flex flex-col justify-between fixed left-0 shadow-md transition-all duration-300 z-[40]
        ${
          isMobile
            ? `${isOpen ? "translate-x-0" : "-translate-x-full"} w-64`
            : `${isOpen ? "w-64" : "w-20"}`
        }
        top-[64px] 
        h-[calc(100vh-64px)]
      `}
    >
      <div>
        <div className={`flex items-center gap-3 px-4 mt-6 ${isOpen ? "justify-start" : "justify-center"}`}>
          <img
            src={user?.avatar || fallbackAvatar}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover border border-purple-100"
          />
          {isOpen && (
            <div>
              <h2 className="font-semibold text-gray-800 leading-tight">{displayName}</h2>
              <p className="text-xs uppercase tracking-wide text-gray-400">{roleLabel.toUpperCase()}</p>
            </div>
          )}
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            <li className={menuItem} onClick={() => handleNavigation("/customer-dashboard")}>
              <MdDashboard size={20} />
              {isOpen && <span>Dashboard</span>}
            </li>
            <li className={menuItem} onClick={() => handleNavigation("/products")}>
              <FaBoxOpen size={20} />
              {isOpen && <span>Products</span>}
            </li>
            <li className={menuItem} onClick={() => handleNavigation("/orders")}>
              <MdShoppingCart size={20} />
              {isOpen && <span>Orders</span>}
            </li>
            <li className={menuItem} onClick={() => handleNavigation("/profiles")}>
              <FaUserCircle size={20} />
              {isOpen && <span>Profile</span>}
            </li>
          </ul>
        </nav>
      </div>

      <div className="p-4 flex flex-col gap-2 text-gray-500">
        <button
          className="flex items-center gap-2 hover:text-purple-600 transition-all"
          onClick={() => handleNavigation("/change-password")}
        >
          <MdSettings size={20} />
          {isOpen && <span>Change Password</span>}
        </button>
        <button
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all"
          onClick={onLogout}
        >
          <MdLogout size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
