import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VendorOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Mock orders data - Replace with actual API call
  const [orders, setOrders] = useState([
    {
      id: "ORD-12345",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1 (555) 123-4567",
      products: [
        { name: "Wireless Headphones Pro", quantity: 2, price: 89.99 },
        { name: "USB-C Cable", quantity: 1, price: 15.99 },
      ],
      totalAmount: 195.97,
      status: "pending",
      paymentStatus: "paid",
      shippingAddress: "123 Main St, New York, NY 10001",
      orderDate: "2026-02-15T10:30:00",
      updatedAt: "2026-02-15T10:30:00",
    },
    {
      id: "ORD-12344",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+1 (555) 234-5678",
      products: [{ name: "Gaming Mouse RGB", quantity: 1, price: 45.5 }],
      totalAmount: 45.5,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
      orderDate: "2026-02-15T09:15:00",
      updatedAt: "2026-02-15T11:20:00",
    },
    {
      id: "ORD-12343",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      customerPhone: "+1 (555) 345-6789",
      products: [{ name: "Mechanical Keyboard", quantity: 1, price: 129.99 }],
      totalAmount: 129.99,
      status: "shipped",
      paymentStatus: "paid",
      shippingAddress: "789 Pine Rd, Chicago, IL 60601",
      orderDate: "2026-02-14T14:20:00",
      updatedAt: "2026-02-15T08:00:00",
      trackingNumber: "TRACK123456789",
    },
    {
      id: "ORD-12342",
      customerName: "Alice Williams",
      customerEmail: "alice@example.com",
      customerPhone: "+1 (555) 456-7890",
      products: [{ name: "USB-C Hub", quantity: 1, price: 35.0 }],
      totalAmount: 35.0,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: "321 Elm St, Houston, TX 77001",
      orderDate: "2026-02-13T16:45:00",
      updatedAt: "2026-02-14T10:30:00",
      deliveredAt: "2026-02-14T10:30:00",
    },
    {
      id: "ORD-12341",
      customerName: "Charlie Brown",
      customerEmail: "charlie@example.com",
      customerPhone: "+1 (555) 567-8901",
      products: [{ name: "Laptop Stand", quantity: 2, price: 49.99 }],
      totalAmount: 99.98,
      status: "cancelled",
      paymentStatus: "refunded",
      shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
      orderDate: "2026-02-13T11:00:00",
      updatedAt: "2026-02-13T15:30:00",
      cancelReason: "Customer requested cancellation",
    },
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "refunded":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
    setShowStatusModal(false);
    setSelectedOrder(null);
    // TODO: Call update API
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading Orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>📋</span>
            Orders Management
          </h1>
          <p className="text-gray-600">
            View and manage all your customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-2xl font-bold text-gray-900">
              {orderStats.total}
            </p>
            <p className="text-xs text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-2xl font-bold text-yellow-600">
              {orderStats.pending}
            </p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-2xl font-bold text-blue-600">
              {orderStats.processing}
            </p>
            <p className="text-xs text-gray-600">Processing</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-2">🚚</div>
            <p className="text-2xl font-bold text-purple-600">
              {orderStats.shipped}
            </p>
            <p className="text-xs text-gray-600">Shipped</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-2xl font-bold text-green-600">
              {orderStats.delivered}
            </p>
            <p className="text-xs text-gray-600">Delivered</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-2">❌</div>
            <p className="text-2xl font-bold text-red-600">
              {orderStats.cancelled}
            </p>
            <p className="text-xs text-gray-600">Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID or Customer name..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Order Info */}
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ordered on{" "}
                          {new Date(order.orderDate).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${getPaymentStatusColor(
                            order.paymentStatus,
                          )}`}
                        >
                          💳{" "}
                          {order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span>👤</span>
                        Customer Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Name</p>
                          <p className="font-semibold text-gray-900">
                            {order.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">
                            {order.customerEmail}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-900">
                            {order.customerPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Shipping Address</p>
                          <p className="font-semibold text-gray-900">
                            {order.shippingAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>📦</span>
                        Products ({order.products.length})
                      </h4>
                      <div className="space-y-2">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {product.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-gray-900">
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <span className="font-bold text-gray-900 text-lg">
                        Total Amount
                      </span>
                      <span className="font-bold text-orange-600 text-2xl">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-semibold text-blue-600">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}

                    {/* Cancel Reason */}
                    {order.cancelReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-600">
                          Cancellation Reason
                        </p>
                        <p className="font-semibold text-red-600">
                          {order.cancelReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="lg:w-64 space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Actions
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowStatusModal(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
                      disabled={
                        order.status === "delivered" ||
                        order.status === "cancelled"
                      }
                    >
                      Update Status
                    </button>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                      Print Invoice
                    </button>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors">
                      Contact Customer
                    </button>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <span className="text-6xl block mb-4">📋</span>
              <p className="text-lg font-semibold text-gray-600">
                No orders found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Update Order Status
            </h2>
            <p className="text-gray-600 mb-6">
              Order ID:{" "}
              <span className="font-semibold">{selectedOrder.id}</span>
            </p>

            <div className="space-y-3 mb-6">
              {["pending", "processing", "shipped", "delivered"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                    className={`w-full p-4 rounded-lg font-semibold transition-all ${
                      selectedOrder.status === status
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-orange-50 hover:bg-orange-100 text-orange-600 border-2 border-orange-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {selectedOrder.status === status && " (Current)"}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
