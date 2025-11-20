/* eslint-disable react/prop-types */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ toggleSidebar, isSidebarOpen, isMobile, onLogout }) {
  const { user } = useContext(AuthContext);
  const displayName = user?.name || user?.fullName || user?.username || "Admin User";
  const roleLabel = user?.role ? user.role.toUpperCase() : "ADMIN";
  const navigate = useNavigate();

  const handleProfileClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/change-password");
  return (
    <header
      className={`
        flex justify-between items-center bg-white px-4 sm:px-6 py-3
        fixed top-0 left-0 right-0 shadow-sm transition-all duration-300 w-full z-[50]
      `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo (Desktop Only) */}
        <div className="hidden md:flex items-center gap-5">
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-2 rounded-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Purple
          </h1>
        </div>

        <div className="flex items-center gap-8 pl-2 md:pl-6">
          {/* Hamburger (Desktop near search) */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 transition"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Search Input (Desktop Only) */}
          <div className="relative hidden md:block">
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a 8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-white/50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-600 outline-none w-64 focus:border-purple-200 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>

        {/* Hamburger (Mobile / Tablet) */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-purple-600 focus:outline-none md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <button type="button">📧</button>
        <button type="button">🔔</button>
        <button
          type="button"
          className="text-gray-500 hover:text-purple-600"
          onClick={handleSettingsClick}
        >
          ⚙
        </button>
        <button
          type="button"
          className="text-red-600 hover:text-red-700"
          onClick={onLogout}
        >
          ⏻
        </button>

        <button
          type="button"
          onClick={handleProfileClick}
          className="flex items-center gap-2 text-left"
        >
          <img
            src={user?.avatar || "https://randomuser.me/api/portraits/men/35.jpg"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover border border-purple-100"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{displayName}</p>
            <p className="text-xs text-gray-400 uppercase">{roleLabel}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
