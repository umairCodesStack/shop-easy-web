import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCustomers } from "../../hooks/useGetCustomers";
import { getUserData } from "../../utils/jwtUtils";
import CustomersTable from "./CustomersTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const VendorAnalytics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const userData = getUserData();
  const {
    data: customers,
    isLoading,
    error,
  } = useGetCustomers(userData.userId);
  const handleDownloadExcel = () => {
    if (!filteredCustomers || filteredCustomers.length === 0) {
      alert("No customers to export.");
      return;
    }

    const worksheetData = filteredCustomers.map((customer, index) => ({
      "#": index + 1,
      Name: customer.name || "-",
      Email: customer.email || "-",
      Phone: customer.phone || "-",
      "Total Orders": customer.totalOrders ?? "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Column widths
    worksheet["!cols"] = [
      { wch: 5 }, // #
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 15 }, // Total Orders
    ];

    XLSX.writeFile(workbook, "all-customers.xlsx");
  };
  const handleDownloadPdf = () => {
    if (!filteredCustomers || filteredCustomers.length === 0) {
      alert("No customers to export.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("All Customers", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Total: ${filteredCustomers.length} customers`, 14, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 31);

    autoTable(doc, {
      startY: 38,
      head: [["#", "Name", "Email", "Phone", "Total Orders"]],
      body: filteredCustomers.map((customer, index) => [
        index + 1,
        customer.name || "-",
        customer.email || "-",
        customer.phone || "-",
        customer.totalOrders ?? "-",
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [249, 115, 22],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [255, 247, 237] },
      margin: { left: 14, right: 14 },
    });

    doc.save("all-customers.pdf");
  };

  // Filter customers based on search query
  const filteredCustomers = customers?.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchQuery)
    );
  });

  // Sort customers
  const sortedCustomers = [...(filteredCustomers || [])].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalCustomers = sortedCustomers?.length || 0;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = sortedCustomers?.slice(startIndex, endIndex);

  // Customer stats
  const totalOrders = customers?.reduce(
    (sum, customer) => sum + customer.totalOrders,
    0,
  );
  const avgOrdersPerCustomer = customers?.length
    ? (totalOrders / customers.length).toFixed(1)
    : 0;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading Customers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>👥</span>
            My Customers
          </h1>
          <p className="text-gray-600">
            Manage and view all your store customers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">
                Total Customers
              </h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {customers?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">
                Total Orders
              </h3>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">
                Avg Orders/Customer
              </h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {avgOrdersPerCustomer}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Customers
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email or phone..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="totalOrders">Total Orders</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order
              </label>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>
          </div>

          {/* Results Info */}
          {totalCustomers > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, totalCustomers)}
                </span>{" "}
                of <span className="font-semibold">{totalCustomers}</span>{" "}
                customers
              </p>
            </div>
          )}
        </div>

        {/* Customers Table */}
        <CustomersTable
          customers={filteredCustomers}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
          paginatedCustomers={paginatedCustomers}
        />

        {/* Download Button */}
        <div className="flex justify-end gap-3 mt-4 mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition duration-200"
            onClick={handleDownloadExcel}
          >
            Download as Excel
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition duration-200"
            onClick={handleDownloadPdf}
          >
            Download as PDF
          </button>
        </div>

        {/* Pagination */}
        {totalCustomers > 0 && totalPages > 1 && (
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
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-orange-300"
                >
                  ← Previous
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === pageNum
                            ? "bg-orange-500 text-white shadow-md"
                            : "border-2 border-gray-200 hover:bg-gray-50 hover:border-orange-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-orange-300"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorAnalytics;
