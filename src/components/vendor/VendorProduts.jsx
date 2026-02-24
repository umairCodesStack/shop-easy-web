import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetStoreProducts } from "../../hooks/useGetStoreProducts";

import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { getUserData } from "../../utils/jwtUtils";

const VendorProducts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const {
    deleteProductMutate,
    error: deletionError,
    isLoading: deletingProduct,
  } = useDeleteProduct();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const userData = getUserData();

  const {
    products,
    error,
    isLoading: isStoreProductsLoading,
  } = useGetStoreProducts(userData.userId);

  const categories = ["All", "Electronics", "Accessories", "Clothing", "Home"];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStatus]);

  const handleDelete = async (productId) => {
    try {
      const imageUrls =
        products.find((p) => p.id === productId)?.imageUrls ?? [];
      deleteProductMutate({ productId, imageUrls });

      // Refresh the product list after deletion
      //window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getStatusBadge = (status, stock) => {
    if (stock === 0 || status === "out_of_stock") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (status === "inactive") {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
    if (stock < 30) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 30) return "Low Stock";
    return "In Stock";
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      product.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && product.status === "active") ||
      (filterStatus === "inactive" && product.status === "inactive") ||
      (filterStatus === "low_stock" &&
        product.stockQuantity < 30 &&
        product.stockQuantity > 0) ||
      (filterStatus === "out_of_stock" && product.stockQuantity === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts?.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span>📦</span>
            My Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your product inventory and listings
          </p>
        </div>
        <Link
          to="/vendor/products/add"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
        >
          <span className="text-xl">➕</span>
          <span className="hidden sm:inline">Add New Product</span>
          <span className="sm:hidden">Add Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs sm:text-sm">
              Total Products
            </span>
            <span className="text-xl sm:text-2xl">📦</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {products?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs sm:text-sm">In Stock</span>
            <span className="text-xl sm:text-2xl">✅</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {products?.filter((p) => p.stockQuantity > 0).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs sm:text-sm">Low Stock</span>
            <span className="text-xl sm:text-2xl">⚠️</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
            {products?.filter(
              (p) => p.stockQuantity < 30 && p.stockQuantity > 0,
            ).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs sm:text-sm">
              Out of Stock
            </span>
            <span className="text-xl sm:text-2xl">❌</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">
            {products?.filter((p) => p.stockQuantity === 0).length || 0}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name..."
                className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-sm sm:text-base"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Items per page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-sm sm:text-base"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* View Toggle (Desktop only) */}
          <div className="hidden lg:flex items-center justify-end gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                viewMode === "table"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {paginatedProducts?.length > 0 ? (
        <>
          {/* Grid View - Show on mobile always, or when viewMode is 'grid' on desktop */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
              viewMode === "table" ? "hidden lg:hidden" : ""
            }`}
          >
            {paginatedProducts?.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    product.imageUrls?.[0] ||
                    product.imageUrl ||
                    "https://via.placeholder.com/400"
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {product.category}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-bold text-gray-900">
                        ${parseFloat(product.finalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stock</p>
                      <p
                        className={`font-bold ${
                          product.stockQuantity === 0
                            ? "text-red-600"
                            : product.stockQuantity < 30
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {product.stockQuantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Discount</p>
                      <p className="font-bold text-gray-900">
                        {product.discount}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadge(
                          product.status,
                          product.stockQuantity,
                        )}`}
                      >
                        {getStatusText(product.stockQuantity)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/vendor/products/edit/${product.id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for Grid View */}
          <div
            className={`bg-white rounded-xl shadow-md p-4 ${
              viewMode === "table" ? "hidden lg:hidden" : ""
            }`}
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 text-center">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                products
              </p>
              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Table View - Only show on desktop and when viewMode is 'table' */}
          <div
            className={`bg-white rounded-xl shadow-md overflow-hidden hidden ${
              viewMode === "table" ? "lg:block" : "lg:hidden"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Product
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Discount
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.imageUrls?.[0] ||
                              product.imageUrl ||
                              "https://via.placeholder.com/400"
                            }
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Added {product.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">
                          ${parseFloat(product.finalPrice || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${
                            product.stockQuantity === 0
                              ? "text-red-600"
                              : product.stockQuantity < 30
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">
                          {product.discount}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadge(
                            product.status,
                            product.stockQuantity,
                          )}`}
                        >
                          {getStatusText(product.stockQuantity)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/vendor/products/edit/${product.id}`}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                          >
                            Edit
                          </Link>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(endIndex, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-2 text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-orange-500 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md py-12 sm:py-16">
          <div className="text-center text-gray-400">
            <span className="text-6xl sm:text-8xl block mb-4">📦</span>
            <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No products found
            </p>
            <p className="text-sm text-gray-500 mb-4 px-4">
              Try adjusting your filters or search query
            </p>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors text-sm sm:text-base"
            >
              <span>➕</span>
              Add Your First Product
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
