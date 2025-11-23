import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AuthContext, serverUrl } from "../context/AuthContext";

const API_BASE_URL = `${serverUrl}/api`;

const StatCard = ({ title, value, subtext }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-50">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-3xl font-semibold text-gray-800 mt-2">{value}</h3>
    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
  </div>
);

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [orderRes, productRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/order/all`),
        axios.get(`${API_BASE_URL}/product/all`),
      ]);
      setOrders(orderRes.data?.orders || []);
      setProducts(productRes.data?.data || []);
    } catch (err) {
      console.error("Customer dashboard data load failed:", err);
      setError("Unable to load live data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const {
    userOrders,
    totalSpend,
    lastOrder,
    activeProductsCount,
    lowStockCount,
    recentOrders,
  } = useMemo(() => {
    const normalizedName = user?.name?.trim().toLowerCase();
    const filteredOrders = normalizedName
      ? orders.filter(
          (order) =>
            order?.name?.trim().toLowerCase() === normalizedName ||
            order?.address?.trim().toLowerCase() === normalizedName
        )
      : [];

    const totalSpent = filteredOrders.reduce(
      (sum, order) => sum + (Number(order.totalPrice) || 0),
      0
    );

    const sortedOrders = [...filteredOrders].sort(
      (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
    );

    const activeProducts = products.filter((p) => (Number(p.stock) || 0) > 0).length;
    const lowStockProducts = products.filter((p) => {
      const stock = Number(p.stock) || 0;
      return stock > 0 && stock <= 5;
    }).length;

    return {
      userOrders: filteredOrders,
      totalSpend: totalSpent,
      lastOrder: sortedOrders[0],
      activeProductsCount: activeProducts,
      lowStockCount: lowStockProducts,
      recentOrders: sortedOrders.slice(0, 5),
    };
  }, [orders, products, user]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-[#f7f8fc]">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Hello, {user?.name || "Customer"} 👋
          </h1>
          <p className="text-gray-500">
            Get a live view of your orders and available products.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-purple-200 text-purple-600 text-sm font-medium hover:bg-purple-50 transition disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 col-span-1">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://randomuser.me/api/portraits/women/44.jpg"}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-500">Customer Profile</p>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name || "User"}</h2>
              <p className="text-gray-500 text-sm">{user?.role?.toUpperCase() || "CUSTOMER"}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Email</span>
              <span className="font-medium text-gray-800">{user?.email || "Not Provided"}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phone</span>
              <span className="font-medium text-gray-800">{user?.phone || "Add phone"}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Address</span>
              <span className="font-medium text-gray-800 text-right">
                {user?.address || "Add address"}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Last Order</span>
              <span className="font-medium text-gray-800 text-right">
                {lastOrder?.productName
                  ? `${lastOrder.productName} (${lastOrder.quantity})`
                  : "No orders yet"}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Total Orders"
              value={loading ? "..." : userOrders.length}
              subtext={userOrders.length ? "Based on your account" : "No orders yet"}
            />
            <StatCard
              title="Total Spent"
              value={
                loading
                  ? "..."
                  : `₹${new Intl.NumberFormat("en-IN").format(Math.round(totalSpend))}`
              }
              subtext={userOrders.length ? "Updated in real-time" : ""}
            />
            <StatCard
              title="Products In Stock"
              value={loading ? "..." : activeProductsCount}
              subtext="Available to order"
            />
            <StatCard
              title="Low Stock Alerts"
              value={loading ? "..." : lowStockCount}
              subtext="May sell out soon"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <span className="text-xs text-gray-400 uppercase">
                {recentOrders.length} shown
              </span>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">
                Place your first order from the products tab to see it here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs uppercase tracking-widest">
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Total</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-t border-gray-100">
                        <td className="py-2 font-medium text-gray-800">{order.productName}</td>
                        <td className="py-2">{order.quantity}</td>
                        <td className="py-2">₹{order.totalPrice}</td>
                        <td className="py-2 text-gray-500">
                          {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}