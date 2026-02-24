import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../utils/jwtUtils";
import useGetCustomerOrders from "../hooks/useCustomerOrders";
import { useRequestCancellation } from "../hooks/useRequestCancellation";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const navigate = useNavigate();
  const userData = getUserData();

  useEffect(() => {
    if (!userData) navigate("/login");
  }, [userData, navigate]);

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetCustomerOrders(userData?.userId);

  const {
    mutate: requestCancellation,
    isLoading: cancelling,
    error: errorCancelling,
  } = useRequestCancellation();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "refunded":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
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

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }
    try {
      requestCancellation({ orderId: selectedOrder.id, reason: cancelReason });
      if (!errorCancelling && !cancelling) {
        setShowCancelModal(false);
        setCancelReason("");
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Cancel order error:", error);
    }
  };

  const handleDownloadInvoicePdf = (order) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 0, pageWidth, 38, "F");

    // Title
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 14, 16);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("ShopEasy — Your Trusted Marketplace", 14, 24);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      14,
      31,
    );

    // Invoice meta (right side)
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice #INV-${order.id}`, pageWidth - 14, 16, {
      align: "right",
    });
    doc.setFont("helvetica", "normal");
    doc.text(`Order: ORD-${order.id}`, pageWidth - 14, 24, { align: "right" });
    doc.text(
      `Order Date: ${new Date(order.orderDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`,
      pageWidth - 14,
      31,
      { align: "right" },
    );

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(14, 44, pageWidth - 14, 44);

    // Order info section
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("STORE", 14, 53);
    doc.text("STATUS", 80, 53);
    doc.text("PAYMENT", 140, 53);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text(order.storeName || "N/A", 14, 61);
    doc.text(order.status || "N/A", 80, 61);
    doc.text(order.paymentStatus || "N/A", 140, 61);

    // Shipping address
    if (order.address) {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.text("SHIPPING ADDRESS", 14, 72);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      const addressLines = doc.splitTextToSize(order.address, pageWidth - 28);
      doc.text(addressLines, 14, 80);
    }

    // Items table
    const tableStartY = order.address ? 92 : 72;

    autoTable(doc, {
      startY: tableStartY,
      head: [["#", "Product", "Color", "Size", "Qty", "Unit Price", "Total"]],
      body:
        order.products?.map((p, i) => [
          i + 1,
          p.productName || "-",
          p.productColor || "-",
          p.productSize || "-",
          p.quantity,
          `$${p.productFinalPrice?.toFixed(2)}`,
          `$${(p.productFinalPrice * p.quantity).toFixed(2)}`,
        ]) || [],
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [249, 115, 22],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [255, 247, 237] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        5: { halign: "right" },
        6: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    // Totals summary
    const finalY = doc.lastAutoTable.finalY + 8;
    const col2X = pageWidth - 14;

    doc.setDrawColor(230, 230, 230);
    doc.line(pageWidth - 80, finalY - 2, col2X, finalY - 2);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Subtotal:", pageWidth - 80, finalY + 6);
    doc.setTextColor(40, 40, 40);
    doc.text(`$${order.totalPrice?.toFixed(2)}`, col2X, finalY + 6, {
      align: "right",
    });

    if (order.shipppingPrice > 0) {
      doc.setTextColor(80, 80, 80);
      doc.text("Shipping:", pageWidth - 80, finalY + 14);
      doc.setTextColor(40, 40, 40);
      doc.text(`$${order.shipppingPrice?.toFixed(2)}`, col2X, finalY + 14, {
        align: "right",
      });
    }

    // Total box
    const totalY = order.shipppingPrice > 0 ? finalY + 22 : finalY + 14;
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(pageWidth - 82, totalY - 6, 68, 14, 2, 2, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL:", pageWidth - 78, totalY + 3);
    doc.text(
      `$${(order.totalPrice + (order.shipppingPrice || 0)).toFixed(2)}`,
      col2X - 2,
      totalY + 3,
      { align: "right" },
    );

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 16;
    doc.setDrawColor(230, 230, 230);
    doc.line(14, footerY - 4, pageWidth - 14, footerY - 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Thank you for shopping with ShopEasy! For support, contact support@shopeasy.com",
      pageWidth / 2,
      footerY,
      { align: "center" },
    );

    doc.save(`invoice-ORD-${order.id}.pdf`);
  };

  // Filter & sort
  const filteredOrders = orders?.filter((order) => {
    const orderId = `ORD-${order.id}`;
    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = filteredOrders?.sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
  );

  const totalOrders = sortedOrders?.length || 0;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = sortedOrders?.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">
              Loading Your Orders...
            </p>
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
            <button
              onClick={() => refetch()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-primary-100">
                Track and manage all your orders
              </p>
            </div>
            <div className="hidden md:block text-6xl">📦</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            {
              icon: "📦",
              value: orderStats.total,
              label: "Total Orders",
              color: "text-gray-900",
            },
            {
              icon: "⏳",
              value: orderStats.pending,
              label: "Pending",
              color: "text-yellow-600",
            },
            {
              icon: "⚙️",
              value: orderStats.processing,
              label: "Processing",
              color: "text-blue-600",
            },
            {
              icon: "🚚",
              value: orderStats.shipped,
              label: "Shipped",
              color: "text-purple-600",
            },
            {
              icon: "✅",
              value: orderStats.delivered,
              label: "Delivered",
              color: "text-green-600",
            },
            {
              icon: "🛑",
              value: orderStats.cancellationRequested,
              label: "Cancel Pending",
              color: "text-orange-600",
            },
            {
              icon: "⚠️",
              value: orderStats.cancellationRejected,
              label: "Cancel Rejected",
              color: "text-pink-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Search by Order ID or Store name..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
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
          </div>
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
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          ORD-{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)} flex items-center gap-1`}
                        >
                          <span>{getStatusIcon(order.status)}</span>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <p>
                          📅{" "}
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        {order.storeName && <p>🏪 {order.storeName}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary-600">
                        $
                        {(
                          order.totalPrice + (order.shipppingPrice || 0)
                        ).toFixed(2)}
                      </p>
                      {order.paymentStatus && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          💳 {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📦</span> Order Items ({order.products?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {order.products?.slice(0, 2).map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        {product.productImageUrl && (
                          <img
                            src={product.productImageUrl}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {product.productName}
                          </p>
                          <div className="flex gap-3 text-sm text-gray-600 mt-1">
                            <p>Qty: {product.quantity}</p>
                            {product.productColor && (
                              <p>• {product.productColor}</p>
                            )}
                            {product.productSize && (
                              <p>• {product.productSize}</p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">
                          $
                          {(
                            product.productFinalPrice * product.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {order.products?.length > 2 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        +{order.products.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  {order.address && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        📍 Shipping Address
                      </p>
                      <p className="text-sm text-gray-600">{order.address}</p>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        🚚 Tracking Number
                      </p>
                      <p className="text-sm font-mono text-purple-600 font-semibold">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                  {order.status?.toLowerCase() === "cancellation requested" && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-semibold text-orange-700 mb-1">
                        🛑 Cancellation Pending
                      </p>
                      <p className="text-sm text-orange-600">
                        Your cancellation request is being reviewed by the
                        seller.
                      </p>
                    </div>
                  )}
                  {order.status?.toLowerCase() === "cancellation rejected" && (
                    <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <p className="text-sm font-semibold text-pink-700 mb-1">
                        ⚠️ Cancellation Rejected
                      </p>
                      <p className="text-sm text-pink-600">
                        Your cancellation request was rejected. Contact the
                        seller for more info.
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="flex-1 min-w-[150px] bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300"
                    >
                      View Details
                    </button>
                    {order.status?.toLowerCase() === "shipped" &&
                      order.trackingNumber && (
                        <button className="flex-1 min-w-[150px] bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300">
                          Track Order
                        </button>
                      )}
                    {(order.status?.toLowerCase() === "pending" ||
                      order.status?.toLowerCase() === "processing" ||
                      order.status?.toLowerCase() ===
                        "cancellation rejected") && (
                      <button
                        disabled={cancelling}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="flex-1 min-w-[150px] bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300"
                      >
                        {order.status?.toLowerCase() === "cancellation rejected"
                          ? "Request Cancellation Again"
                          : "Cancel Order"}
                      </button>
                    )}
                    {order.status?.toLowerCase() === "delivered" && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowInvoiceModal(true);
                        }}
                        className="flex-1 min-w-[150px] bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300"
                      >
                        Download Invoice
                      </button>
                    )}
                    <button className="flex-1 min-w-[150px] bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <span className="text-6xl block mb-4">📦</span>
              <p className="text-xl font-semibold text-gray-600 mb-2">
                No orders found
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Start shopping to see your orders here"}
              </p>
              <Link
                to="/products"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalOrders > 0 && totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary-300"
                >
                  ← Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNum ? "bg-primary-500 text-white shadow-md" : "border-2 border-gray-200 hover:bg-gray-50 hover:border-primary-300"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary-300"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Cancel Modal ── */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {!cancelling
                ? selectedOrder.status?.toLowerCase() ===
                  "cancellation rejected"
                  ? "Request Cancellation Again"
                  : "Cancel Order"
                : "Sending Cancellation Request"}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedOrder.status?.toLowerCase() === "cancellation rejected"
                ? "Your previous request was rejected. Request again for order "
                : "Are you sure you want to cancel order "}
              <span className="font-semibold">ORD-{selectedOrder.id}</span>?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you're cancelling..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none"
                rows="4"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {selectedOrder.status?.toLowerCase() === "cancellation rejected"
                  ? "Submit Request"
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Invoice Preview Modal ── */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  🧾
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Invoice Preview
                  </h2>
                  <p className="text-sm text-gray-500">
                    ORD-{selectedOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Invoice Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Invoice Top */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold">🛍️ ShopEasy</p>
                    <p className="text-orange-100 text-sm mt-1">
                      Your Trusted Marketplace
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">INVOICE</p>
                    <p className="text-orange-100 text-sm">
                      #INV-{selectedOrder.id}
                    </p>
                    <p className="text-orange-100 text-xs mt-1">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Meta */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Order
                  </p>
                  <p className="font-bold text-gray-900">
                    ORD-{selectedOrder.id}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}
                  >
                    {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Date
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {new Date(selectedOrder.orderDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "short", day: "numeric" },
                    )}
                  </p>
                </div>
              </div>

              {/* Store & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedOrder.storeName && (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                      Store
                    </p>
                    <p className="font-semibold text-gray-900">
                      🏪 {selectedOrder.storeName}
                    </p>
                  </div>
                )}
                {selectedOrder.address && (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                      Ship To
                    </p>
                    <p className="text-sm text-gray-700">
                      📍 {selectedOrder.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Order Items
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-orange-50 border-b border-orange-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">
                          Qty
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">
                          Unit Price
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products?.map((product, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {product.productImageUrl && (
                                <img
                                  src={product.productImageUrl}
                                  alt={product.productName}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {product.productName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {[product.productColor, product.productSize]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            ${product.productFinalPrice?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900">
                            $
                            {(
                              product.productFinalPrice * product.quantity
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${selectedOrder.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  {selectedOrder.shipppingPrice > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        ${selectedOrder.shipppingPrice?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-orange-500 text-white px-4 py-3 rounded-xl mt-2">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold">
                      $
                      {(
                        selectedOrder.totalPrice +
                        (selectedOrder.shipppingPrice || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              {selectedOrder.paymentMethod && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Payment:{" "}
                    <span className="font-semibold uppercase">
                      {selectedOrder.paymentMethod}
                    </span>
                  </span>
                  {selectedOrder.paymentStatus && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                    >
                      💳 {selectedOrder.paymentStatus}
                    </span>
                  )}
                </div>
              )}

              {/* Thank you note */}
              <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                Thank you for shopping with ShopEasy! · support@shopeasy.com
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadInvoicePdf(selectedOrder)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>⬇️</span> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Details Modal ── */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details — ORD-{selectedOrder.id}
              </h2>
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(selectedOrder.status)}`}
                  >
                    {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.orderDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {product.productImageUrl && (
                        <img
                          src={product.productImageUrl}
                          alt={product.productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {product.productName}
                        </p>
                        <div className="flex gap-3 text-sm text-gray-600 mt-1">
                          <p>Quantity: {product.quantity}</p>
                          {product.productColor && (
                            <p>• {product.productColor}</p>
                          )}
                          {product.productSize && (
                            <p>• {product.productSize}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          $
                          {(
                            product.productFinalPrice * product.quantity
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${product.productFinalPrice?.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${selectedOrder.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  {selectedOrder.shipppingPrice > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-semibold">
                        ${selectedOrder.shipppingPrice?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      $
                      {(
                        selectedOrder.totalPrice +
                        (selectedOrder.shipppingPrice || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              {selectedOrder.address && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-700">{selectedOrder.address}</p>
                  </div>
                </div>
              )}
              {selectedOrder.paymentMethod && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Payment Information
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-semibold uppercase">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    {selectedOrder.paymentStatus && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600">Payment Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                        >
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
              {selectedOrder.status?.toLowerCase() === "delivered" && (
                <button
                  onClick={() => {
                    setShowOrderDetails(false);
                    setShowInvoiceModal(true);
                  }}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  View Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
