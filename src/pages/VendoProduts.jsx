import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const VendorProducts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones Pro",
      category: "Electronics",
      price: 89.99,
      stock: 45,
      sales: 234,
      status: "active",
      image: "https://via.placeholder.com/100",
      createdAt: "2026-01-15",
    },
    {
      id: 2,
      name: "Gaming Mouse RGB",
      category: "Electronics",
      price: 45.5,
      stock: 67,
      sales: 189,
      status: "active",
      image: "https://via.placeholder.com/100",
      createdAt: "2026-01-20",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      category: "Electronics",
      price: 129.99,
      stock: 23,
      sales: 156,
      status: "active",
      image: "https://via.placeholder.com/100",
      createdAt: "2026-01-25",
    },
    {
      id: 4,
      name: "USB-C Hub",
      category: "Accessories",
      price: 35.0,
      stock: 0,
      sales: 89,
      status: "out_of_stock",
      image: "https://via.placeholder.com/100",
      createdAt: "2026-02-01",
    },
    {
      id: 5,
      name: "Laptop Stand",
      category: "Accessories",
      price: 49.99,
      stock: 120,
      sales: 67,
      status: "inactive",
      image: "https://via.placeholder.com/100",
      createdAt: "2026-02-05",
    },
  ]);

  const categories = ["All", "Electronics", "Accessories", "Clothing", "Home"];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
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

  const getStatusText = (status, stock) => {
    if (stock === 0 || status === "out_of_stock") return "Out of Stock";
    if (status === "inactive") return "Inactive";
    if (stock < 30) return "Low Stock";
    return "Active";
  };

  const filteredProducts = products.filter((product) => {
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
        product.stock < 30 &&
        product.stock > 0) ||
      (filterStatus === "out_of_stock" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs sm:text-sm">Active</span>
            <span className="text-xl sm:text-2xl">✅</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {products.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs sm:text-sm">Low Stock</span>
            <span className="text-xl sm:text-2xl">⚠️</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
            {products.filter((p) => p.stock < 30 && p.stock > 0).length}
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
            {products.filter((p) => p.stock === 0).length}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
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
      {filteredProducts.length > 0 ? (
        <>
          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
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
                        ${product.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stock</p>
                      <p
                        className={`font-bold ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock < 30
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sales</p>
                      <p className="font-bold text-gray-900">{product.sales}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadge(
                          product.status,
                          product.stock,
                        )}`}
                      >
                        {/* ↑ Added whitespace-nowrap */}
                        {getStatusText(product.status, product.stock)}
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

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
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
                      Sales
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
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
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
                          ${product.price}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 30
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">{product.sales}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadge(
                            product.status,
                            product.stock,
                          )}`}
                        >
                          {/* ↑ Added inline-block and whitespace-nowrap */}
                          {getStatusText(product.status, product.stock)}
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
                  ))}{" "}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                of <span className="font-semibold">{products.length}</span>{" "}
                products
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                  Next
                </button>
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
