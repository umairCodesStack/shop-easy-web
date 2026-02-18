import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VendorDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock vendor data - Replace with actual API call
  const [vendorData, setVendorData] = useState({
    store: {
      name: "TechVault Store",
      logo: "💻",
      isActive: true,
      rating: 4.8,
      totalReviews: 234,
    },
    stats: {
      totalProducts: 156,
      totalOrders: 1243,
      pendingOrders: 23,
      totalRevenue: 45670.5,
      monthlyRevenue: 12340.0,
      totalCustomers: 892,
    },
    recentOrders: [
      {
        id: "#ORD-12345",
        customerName: "John Doe",
        product: "Wireless Headphones",
        amount: 89.99,
        status: "pending",
        date: "2026-02-15",
      },
      {
        id: "#ORD-12344",
        customerName: "Jane Smith",
        product: "Gaming Mouse",
        amount: 45.5,
        status: "processing",
        date: "2026-02-15",
      },
      {
        id: "#ORD-12343",
        customerName: "Bob Johnson",
        product: "Mechanical Keyboard",
        amount: 129.99,
        status: "shipped",
        date: "2026-02-14",
      },
      {
        id: "#ORD-12342",
        customerName: "Alice Williams",
        product: "USB-C Hub",
        amount: 35.0,
        status: "delivered",
        date: "2026-02-14",
      },
    ],
    topProducts: [
      {
        id: 1,
        name: "Wireless Headphones Pro",
        sales: 234,
        revenue: 20970.66,
        stock: 45,
        image: "🎧",
      },
      {
        id: 2,
        name: "Gaming Mouse RGB",
        sales: 189,
        revenue: 8595.5,
        stock: 67,
        image: "🖱️",
      },
      {
        id: 3,
        name: "Mechanical Keyboard",
        sales: 156,
        revenue: 20264.44,
        stock: 23,
        image: "⌨️",
      },
    ],
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your store today
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/vendor/products"
              className="inline-flex items-center gap-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <span className="text-xl">📦</span>
              View All Products
            </Link>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="text-xl">➕</span>
              Add New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💰</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
              All Time
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold mb-2">
            ${vendorData.stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-white/80 text-xs">
            ${vendorData.stats.monthlyRevenue.toLocaleString()} this month
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📦</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
              {vendorData.stats.pendingOrders} Pending
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">
            Total Orders
          </h3>
          <p className="text-3xl font-bold mb-2">
            {vendorData.stats.totalOrders.toLocaleString()}
          </p>
          <p className="text-white/80 text-xs">+12% from last month</p>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📱</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
              Active
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">
            Total Products
          </h3>
          <p className="text-3xl font-bold mb-2">
            {vendorData.stats.totalProducts}
          </p>
          <p className="text-white/80 text-xs">Across all categories</p>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">👥</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
              {vendorData.store.rating} ⭐
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">
            Total Customers
          </h3>
          <p className="text-3xl font-bold mb-2">
            {vendorData.stats.totalCustomers.toLocaleString()}
          </p>
          <p className="text-white/80 text-xs">
            {vendorData.store.totalReviews} reviews
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📋</span>
                Recent Orders
              </h2>
              <Link
                to="/vendor/orders"
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendorData.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {order.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">
                          {order.customerName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">{order.product}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          ${order.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>🔥</span>
                Top Selling Products
              </h2>
              <Link
                to="/vendor/products"
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
              >
                Manage Products →
              </Link>
            </div>

            <div className="space-y-4">
              {vendorData.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                      {product.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.sales} sales · Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚡</span>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/vendor/products/add"
                className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl">➕</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-orange-600">
                    Add Product
                  </p>
                  <p className="text-xs text-gray-500">List a new item</p>
                </div>
              </Link>

              <Link
                to="/vendor/orders"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                    View Orders
                  </p>
                  <p className="text-xs text-gray-500">
                    {vendorData.stats.pendingOrders} pending
                  </p>
                </div>
              </Link>

              <Link
                to="/vendor/store"
                className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl">🏪</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                    Store Settings
                  </p>
                  <p className="text-xs text-gray-500">Update your store</p>
                </div>
              </Link>

              <Link
                to="/vendor/analytics"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-green-600">
                    Analytics
                  </p>
                  <p className="text-xs text-gray-500">View insights</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Store Performance */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📈</span>
              Store Performance
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 text-sm">
                    Customer Satisfaction
                  </span>
                  <span className="font-bold">{vendorData.store.rating}/5</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2"
                    style={{
                      width: `${(vendorData.store.rating / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 text-sm">
                    Order Fulfillment
                  </span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 text-sm">Response Time</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2"
                    style={{ width: "87%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏪</span>
              Store Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Store Active</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-semibold">Live</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Products</span>
                <span className="font-semibold text-gray-900">
                  {vendorData.stats.totalProducts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Views</span>
                <span className="font-semibold text-gray-900">12.4K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Joined</span>
                <span className="font-semibold text-gray-900">Jan 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
