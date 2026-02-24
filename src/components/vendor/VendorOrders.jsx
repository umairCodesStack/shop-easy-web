import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetVendorOrder } from "../../hooks/useGetVendorOrder";
import { getUserData } from "../../utils/jwtUtils";

import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";

const VendorOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { userId } = getUserData();
  const { data: orders, isLoading, error, refetch } = useGetVendorOrder(userId);
  const {
    mutate: updateOrderStatus,
    isLoading: updatingStatus,
    error: updateError,
  } = useUpdateOrderStatus();
  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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
      case "cancellation requested":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancellation rejected":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      case "cancellation requested":
        return "🛑";
      case "cancellation rejected":
        return "⚠️";
      default:
        return "📦";
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    try {
      updateOrderStatus({ orderId, newStatus });
    } catch (error) {
      console.log(error);
    }
  };

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const orderId = `ORD-${order.id}`;
    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalOrders = filteredOrders?.length || 0;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders?.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = (e) => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const orderStats = {
    total: orders?.length || 0,
    pending:
      orders?.filter((o) => o.status?.toLowerCase() === "pending").length || 0,
    processing:
      orders?.filter((o) => o.status?.toLowerCase() === "processing").length ||
      0,
    shipped:
      orders?.filter((o) => o.status?.toLowerCase() === "shipped").length || 0,
    delivered:
      orders?.filter((o) => o.status?.toLowerCase() === "delivered").length ||
      0,
    cancelled:
      orders?.filter((o) => o.status?.toLowerCase() === "cancelled").length ||
      0,
    cancellationRequested:
      orders?.filter(
        (o) => o.status?.toLowerCase() === "cancellation requested",
      ).length || 0,
    cancellationRejected:
      orders?.filter((o) => o.status?.toLowerCase() === "cancellation rejected")
        .length || 0,
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <span className="text-6xl block mb-4">⚠️</span>
            <p className="text-lg font-semibold text-red-600">
              Error loading orders
            </p>
            <p className="text-sm text-red-500 mt-2">{error.message}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-2xl font-bold text-gray-900">
              {orderStats.total}
            </p>
            <p className="text-xs text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-2xl font-bold text-yellow-600">
              {orderStats.pending}
            </p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-2xl font-bold text-blue-600">
              {orderStats.processing}
            </p>
            <p className="text-xs text-gray-600">Processing</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">🚚</div>
            <p className="text-2xl font-bold text-purple-600">
              {orderStats.shipped}
            </p>
            <p className="text-xs text-gray-600">Shipped</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-2xl font-bold text-green-600">
              {orderStats.delivered}
            </p>
            <p className="text-xs text-gray-600">Delivered</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">❌</div>
            <p className="text-2xl font-bold text-red-600">
              {orderStats.cancelled}
            </p>
            <p className="text-xs text-gray-600">Cancelled</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">🛑</div>
            <p className="text-2xl font-bold text-orange-600">
              {orderStats.cancellationRequested}
            </p>
            <p className="text-xs text-gray-600">Cancel Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-2xl font-bold text-pink-600">
              {orderStats.cancellationRejected}
            </p>
            <p className="text-xs text-gray-600">Cancel Rejected</p>
          </div>
        </div>

        {/* Filters and Pagination Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="cancellation requested">
                  Cancellation Requested
                </option>
                <option value="cancellation rejected">
                  Cancellation Rejected
                </option>
              </select>
            </div>

            {/* Items Per Page */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Orders Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value={5}>5 orders</option>
                <option value={10}>10 orders</option>
                <option value={15}>15 orders</option>
                <option value={20}>20 orders</option>
                <option value={50}>50 orders</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          {totalOrders > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, totalOrders)}
                </span>{" "}
                of <span className="font-semibold">{totalOrders}</span> orders
              </p>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {paginatedOrders && paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
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
                          ORD-{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ordered on{" "}
                          {new Date(order.orderDate).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        {order.storeName && (
                          <p className="text-sm text-gray-500 mt-1">
                            🏪 {order.storeName}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(
                            order.status,
                          )} flex items-center gap-1`}
                        >
                          <span>{getStatusIcon(order.status)}</span>
                          {order.status}
                        </span>
                        {order.paymentStatus && (
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${getPaymentStatusColor(
                              order.paymentStatus,
                            )}`}
                          >
                            💳 {order.paymentStatus}
                          </span>
                        )}
                        {order.paymentMethod && (
                          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700">
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cancellation Request Notice */}
                    {order.status?.toLowerCase() ===
                      "cancellation requested" && (
                      <div className="mb-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                        <p className="text-sm font-semibold text-orange-700 mb-1 flex items-center gap-2">
                          <span>🛑</span>
                          Action Required: Cancellation Request Pending
                        </p>
                        <p className="text-sm text-orange-600">
                          Customer has requested to cancel this order. Please
                          review and take action.
                        </p>
                      </div>
                    )}

                    {/* Cancellation Rejected Notice */}
                    {order.status?.toLowerCase() ===
                      "cancellation rejected" && (
                      <div className="mb-4 p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                        <p className="text-sm font-semibold text-pink-700 mb-1 flex items-center gap-2">
                          <span>⚠️</span>
                          Cancellation Request Rejected
                        </p>
                        <p className="text-sm text-pink-600">
                          You have rejected the customer's cancellation request.
                          The order will proceed as normal.
                        </p>
                      </div>
                    )}

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
                            {order.customerName || "N/A"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-gray-600">Shipping Address</p>
                          <p className="font-semibold text-gray-900">
                            {order.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>📦</span>
                        Products ({order.products?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.products?.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-start p-3 bg-gray-50 rounded-lg gap-3"
                          >
                            <div className="flex gap-3 flex-1">
                              {product.productImageUrl && (
                                <img
                                  src={product.productImageUrl}
                                  alt={product.productName}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {product.productName}
                                </p>
                                <div className="flex gap-3 text-sm text-gray-600 mt-1">
                                  <p>Qty: {product.quantity}</p>
                                  {product.productColor && (
                                    <p>Color: {product.productColor}</p>
                                  )}
                                  {product.productSize && (
                                    <p>Size: {product.productSize}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="font-bold text-gray-900 whitespace-nowrap">
                              $
                              {(
                                product.productFinalPrice * product.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="space-y-2">
                      {order.shipppingPrice > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700">
                            Shipping Fee
                          </span>
                          <span className="font-semibold text-gray-700">
                            ${order.shipppingPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                        <span className="font-bold text-gray-900 text-lg">
                          Total Amount
                        </span>
                        <span className="font-bold text-orange-600 text-2xl">
                          $
                          {(
                            order.totalPrice + (order.shipppingPrice || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
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
                    {order.cancellationReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Cancellation Reason
                        </p>
                        <p className="text-sm text-red-600">
                          {order.cancellationReason}
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
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        order.status?.toLowerCase() === "delivered" ||
                        order.status?.toLowerCase() === "cancelled"
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

        {/* Pagination Controls */}
        {totalOrders > 0 && totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-orange-300"
                >
                  ← Previous
                </button>

                {/* Page Number Buttons */}
                <div className="hidden sm:flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentPage === page
                              ? "bg-orange-500 text-white shadow-md"
                              : "border-2 border-gray-200 hover:bg-gray-50 hover:border-orange-300"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-orange-300"
                >
                  Next →
                </button>
              </div>

              {/* Quick Jump (Mobile) */}
              <div className="sm:hidden w-full">
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <option key={page} value={page}>
                        Page {page}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Update Order Status
            </h2>
            <p className="text-gray-600 mb-2">
              Order ID:{" "}
              <span className="font-semibold">ORD-{selectedOrder.id}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Current Status:{" "}
              <span className="font-semibold">{selectedOrder.status}</span>
            </p>

            {selectedOrder.status?.toLowerCase() ===
              "cancellation requested" && (
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <p className="text-sm font-semibold text-orange-700 mb-2">
                  Customer Cancellation Request
                </p>
                <p className="text-sm text-orange-600">
                  Please choose whether to approve or reject the cancellation
                  request.
                </p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "reject cancellation",
                "cancell",
              ]
                .filter((status) => {
                  // Only show "reject cancellation" and "cancell" if current status is "cancellation requested"
                  if (
                    status === "reject cancellation" ||
                    status === "cancell"
                  ) {
                    return (
                      selectedOrder.status?.toLowerCase() ===
                      "cancellation requested"
                    );
                  }
                  return true;
                })
                .map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, status);
                      setShowStatusModal(false);
                      setSelectedOrder(null);
                    }}
                    disabled={selectedOrder.status?.toLowerCase() === status}
                    className={`w-full p-4 rounded-lg font-semibold transition-all ${
                      selectedOrder.status?.toLowerCase() === status
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : status === "cancell"
                          ? "bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200"
                          : status === "reject cancellation"
                            ? "bg-pink-50 hover:bg-pink-100 text-pink-600 border-2 border-pink-200"
                            : "bg-orange-50 hover:bg-orange-100 text-orange-600 border-2 border-orange-200"
                    }`}
                  >
                    {status === "cancell"
                      ? "✅ Approve Cancellation"
                      : status === "reject cancellation"
                        ? "❌ Reject Cancellation"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    {selectedOrder.status?.toLowerCase() === status &&
                      " (Current)"}
                  </button>
                ))}
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
