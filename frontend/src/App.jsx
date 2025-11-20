import { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";                 // Admin Sidebar
import Navbar from "./components/Navbar";                   // Admin Navbar
import CustomerSidebar from "./components/Customersidebar"; // Customer Sidebar
import CustomerNavbar from "./components/Customernavbar";   // Customer Navbar
import { AuthContext } from "./context/AuthContext";

import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";

import Category from "./components/Category";
import Supplier from "./components/Supplier";
import Product from "./components/Product";
import User from "./components/User";
import CustomerProduct from "./components/CustomerProduct";
import CustomerOrders from "./components/CustomerOrder";
import Order from "./components/Order";
import Profile from "./components/Profile";
import UserProfile from "./components/UserProfile";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto hide sidebar on mobile
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleNavSelect = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
    navigate("/login");
  };

  // Hide layout on login page
  const isLoginPage = location.pathname === "/login";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f8fc]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f7f8fc] overflow-x-hidden">
      
      {/* ---------- SIDEBAR ---------- */}
      {!isLoginPage && isLoggedIn && (
        user?.role === "admin"
          ? (
            <Sidebar
              isOpen={isSidebarOpen}
              isMobile={isMobile}
              onLogout={handleLogout}
              onItemSelect={handleNavSelect}
            />
          )
          : (
            <CustomerSidebar
              isOpen={isSidebarOpen}
              isMobile={isMobile}
              onLogout={handleLogout}
              onItemSelect={handleNavSelect}
            />
          )
      )}

      <div
        className={`flex flex-col transition-all duration-300 min-h-screen relative z-[30]
        ${isLoginPage
            ? "ml-0"
            : isMobile
            ? "ml-0"
            : isSidebarOpen
            ? "ml-64"
            : "ml-20"
        }`}
      >
        {/* ---------- NAVBAR ---------- */}
        {!isLoginPage && isLoggedIn && (
          user?.role === "admin"
            ? (
              <Navbar
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                onLogout={handleLogout}
              />
            )
            : (
              <CustomerNavbar
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                onLogout={handleLogout}
              />
            )
        )}

        {/* ---------- MAIN CONTENT ---------- */}
        <main className={`${isLoginPage ? "mt-0" : "mt-20"} p-6`}>
          <Routes>

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                isLoggedIn
                  ? (
                    <Navigate
                      to={user?.role === "admin" ? "/admin-dashboard" : "/customer-dashboard"}
                      replace
                    />
                  )
                  : <Login />
              }
            />

            {/* If NOT logged in -> redirect to login */}
            {!isLoggedIn && (
              <Route path="*" element={<Navigate to="/login" />} />
            )}

            {/* ---------- ROLE BASED DASHBOARDS ---------- */}
            <Route
              path="/admin-dashboard"
              element={
                !isLoggedIn ? (
                  <Navigate to="/login" replace />
                ) : user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/customer-dashboard" replace />
                )
              }
            />

            <Route
              path="/customer-dashboard"
              element={
                !isLoggedIn ? (
                  <Navigate to="/login" replace />
                ) : user?.role === "customer" ? (
                  <CustomerDashboard />
                ) : (
                  <Navigate to="/admin-dashboard" replace />
                )
              }
            />

            {/* ---------- OTHER ROUTES ---------- */}
            <Route
              path="/category"
              element={isLoggedIn ? <Category /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/supplier"
              element={isLoggedIn ? <Supplier /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/product"
              element={isLoggedIn ? <Product /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/user"
              element={isLoggedIn ? <User /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/products"
              element={isLoggedIn ? <CustomerProduct /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/orders"
              element={isLoggedIn ? <CustomerOrders /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/order"
              element={isLoggedIn ? <Order /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profiles"
              element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/change-password"
              element={isLoggedIn ? <ChangePassword /> : <Navigate to="/login" replace />}
            />

            {/* DEFAULT ROUTE */}
            <Route
              path="/"
              element={
                isLoggedIn
                  ? (
                    <Navigate
                      to={user?.role === "admin" ? "/admin-dashboard" : "/customer-dashboard"}
                      replace
                    />
                  )
                  : <Navigate to="/login" replace />
              }
            />

          </Routes>
        </main>
      </div>
    </div>
  );
}
