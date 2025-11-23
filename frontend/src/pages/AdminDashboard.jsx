import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {serverUrl} from "../context/AuthContext";
 
const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const StatCard = ({ title, value, subtext, gradient }) => (
  <div
    className={`p-6 rounded-2xl text-white shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">{title}</h2>
      <span className="text-xs uppercase tracking-wide text-white/70">{subtext}</span>
    </div>
    <p className="text-3xl font-bold mt-4">{value}</p>
  </div>
);

const SectionCard = ({ title, children, countBadge }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {typeof countBadge === "number" && (
        <span className="text-xs font-semibold bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
          {countBadge}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [productRes, orderRes] = await Promise.all([
        axios.get(`${serverUrl}/api/product/all`, config),
        axios.get(`${serverUrl}/api/order/all`, config),
      ]);

      setProducts(productRes?.data?.data || []);
      setOrders(orderRes?.data?.orders || []);
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
      setError("Unable to load live data. Please log in again or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const {
    totalProducts,
    totalStock,
    ordersToday,
    todaysRevenue,
    bestSeller,
    outOfStock,
    lowStock,
  } = useMemo(() => {
    const totalProductsCount = products.length;
    const totalStockUnits = products.reduce(
      (sum, item) => sum + (Number(item.stock) || 0),
      0
    );

    const today = new Date();
    const normalizeDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const todaysOrders = orders.filter((order) => {
      const orderDate = normalizeDate(order.date || order.createdAt);
      if (!orderDate) return false;
      return (
        orderDate.getFullYear() === today.getFullYear() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getDate() === today.getDate()
      );
    });

    const todaysRevenueSum = todaysOrders.reduce(
      (sum, order) => sum + (Number(order.totalPrice) || 0),
      0
    );

    const salesMap = {};
    orders.forEach((order) => {
      const key = order.productName || "Unknown";
      if (!salesMap[key]) {
        salesMap[key] = {
          productName: key,
          category: order.category || "N/A",
          units: 0,
        };
      }
      salesMap[key].units += Number(order.quantity) || 0;
    });

    const bestSellerProduct = Object.values(salesMap).sort(
      (a, b) => b.units - a.units
    )[0];

    const outOfStockProducts = products.filter(
      (product) => (Number(product.stock) || 0) === 0
    );

    const lowStockProducts = products
      .filter((product) => {
        const stock = Number(product.stock) || 0;
        return stock > 0 && stock <= 10;
      })
      .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0));

    return {
      totalProducts: totalProductsCount,
      totalStock: totalStockUnits,
      ordersToday: todaysOrders,
      todaysRevenue: todaysRevenueSum,
      bestSeller: bestSellerProduct,
      outOfStock: outOfStockProducts,
      lowStock: lowStockProducts,
    };
  }, [products, orders]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 bg-[#f7f8fc]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <p className="text-sm uppercase text-gray-400 tracking-widest">Inventory Overview</p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">
            Welcome back, {user?.name || "Admin"} 👋
          </h1>
          <p className="text-gray-500">
            Track live products, stock, incoming orders and revenue in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-purple-200 text-purple-600 text-sm font-medium hover:bg-purple-50 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={loading ? "..." : totalProducts}
          subtext="catalog"
          gradient="bg-gradient-to-r from-purple-500 to-indigo-500"
        />
        <StatCard
          title="Total Stock Units"
          value={loading ? "..." : totalStock}
          subtext="warehouse"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-600"
        />
        <StatCard
          title="Orders Today"
          value={loading ? "..." : ordersToday.length}
          subtext="live"
          gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Today's Revenue"
          value={loading ? "..." : formatCurrency(todaysRevenue)}
          subtext="sales"
          gradient="bg-gradient-to-r from-orange-400 to-pink-500"
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <SectionCard title="Out of Stock" countBadge={outOfStock.length}>
          {outOfStock.length === 0 ? (
            <p className="text-sm text-gray-500">Great! Every product is in stock.</p>
          ) : (
            <ul className="space-y-3">
              {outOfStock.slice(0, 6).map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between text-sm border border-red-50 rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {product.categoryId?.name || "Uncategorized"}
                    </p>
                  </div>
                  <span className="text-red-500 font-semibold text-xs uppercase tracking-wide">
                    Out
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Highest Sale Product">
          {(!bestSeller || bestSeller.units === 0) ? (
            <p className="text-sm text-gray-500">Sales data will appear after orders arrive.</p>
          ) : (
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6">
              <p className="text-sm uppercase tracking-wide text-white/80">Top Performer</p>
              <h3 className="text-2xl font-semibold mt-2">{bestSeller.productName}</h3>
              <p className="text-white/80 text-sm">
                Category: {bestSeller.category || "N/A"}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-white/70">Total Units Sold</p>
                  <p className="text-3xl font-bold">{bestSeller.units}</p>
                </div>
                <div className="text-right text-white/70 text-xs">
                  <p>Updated in real-time</p>
                  <p>Powered by orders data</p>
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Low Stock Alert */}
      <div className="mt-8">
        <SectionCard title="Low Stock Alert" countBadge={lowStock.length}>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">No low stock warnings. Keep up the good work!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowStock.slice(0, 6).map((product) => (
                <div
                  key={product._id}
                  className="border border-yellow-100 bg-yellow-50 rounded-xl px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.categoryId?.name || "Uncategorized"}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-yellow-600 bg-white px-3 py-1 rounded-full">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}