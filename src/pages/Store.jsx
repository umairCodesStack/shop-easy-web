import { useState, useMemo } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import useGetProducts from "../hooks/useGetProducts";
import { PageSize as pageSize } from "../utils/constants";
import Navbar from "../components/common/Navbar";
import useGetStore from "../hooks/useGetStore";
import { useGetStoreProducts } from "../hooks/useGetStoreProducts";
const Store = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const { storeData, error: storeError, isLoading } = useGetStore(id);

  const {
    products: allProducts = [],
    isLoading: loading,
    error,
  } = useGetStoreProducts(id);
  console.log("Store All Products", allProducts);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get unique categories
  const catagories = useMemo(() => {
    return allProducts?.reduce((acc, product) => {
      if (product.category && !acc.includes(product.category)) {
        acc.push(product.category);
      }
      return acc;
    }, []);
  }, [allProducts]);

  // Filter States
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    priceRange: "",
    rating: "",
    sortBy: "default",
  });

  // Apply filters to ALL products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        filtered = filtered.filter(
          (p) => p.finalPrice >= min && p.finalPrice <= max,
        );
      } else {
        filtered = filtered.filter((p) => p.finalPrice >= min);
      }
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter((p) => p.rating >= Number(filters.rating));
    }

    // Sort products
    if (filters.sortBy === "price-asc") {
      filtered.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (filters.sortBy === "price-desc") {
      filtered.sort((a, b) => b.finalPrice - a.finalPrice);
    } else if (filters.sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "popular") {
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return filtered;
  }, [allProducts, filters]);

  // Calculate pagination values based on filtered products
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Get current page products (client-side pagination)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      rating: "",
      sortBy: "default",
    });
    setCurrentPage(1);
  };

  // Pagination handlers
  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
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

  const searchQuery = searchParams.get("search");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="text-6xl mb-4">❌</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error Loading Store
        </h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      {/* Page Header */}
      <div className="relative bg-white shadow-md mb-2">
        {/* Banner */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-b-2xl">
          <img
            src={
              storeData?.bannerUrl ||
              "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&auto=format&fit=crop"
            }
            alt="Store Banner"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay at bottom so logo area is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Store name + status overlaid bottom-left on banner */}
          <div className="absolute bottom-4 left-36 md:left-44">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg leading-tight">
              {storeData?.name || "My Store"}
            </h1>
            <p className="text-white/80 text-sm drop-shadow">
              {searchQuery ? `Search: "${searchQuery}"` : ""}
            </p>
          </div>
        </div>

        {/* Logo overlapping banner */}
        <div className="absolute left-6 md:left-10 bottom-[-20px] translate-y-[-30%]">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            {storeData?.logoUrl ? (
              <img
                src={storeData.logoUrl}
                alt={storeData?.storeName || "Store Logo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
                🏪
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar: product count + status */}
        <div className="flex items-center justify-between px-6 md:px-10 pt-4 pb-4 pl-36 md:pl-48">
          <div>
            {/* <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
              Status
            </p>
            <sp an className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
              {storeData?.status || "Pending"}
            </sp>*/}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
              Products
            </p>
            <p className="text-sm font-bold text-gray-700">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <span className="text-xl">🔍</span>
              Filters & Sort
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`${
              isMobileFilterOpen ? "block" : "hidden"
            } lg:block lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📂</span> Category
                </h3>
                <div className="space-y-2">
                  {catagories?.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary-600"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💰</span> Price Range
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "", label: "All Prices" },
                    { value: "0-25", label: "Under $25" },
                    { value: "25-50", label: "$25 - $50" },
                    { value: "50-100", label: "$50 - $100" },
                    { value: "100-200", label: "$100 - $200" },
                    { value: "200", label: "$200 & Above" },
                  ].map((price) => (
                    <label
                      key={price.value}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary-600"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={price.value}
                        checked={filters.priceRange === price.value}
                        onChange={(e) =>
                          handleFilterChange("priceRange", e.target.value)
                        }
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm">{price.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>⭐</span> Rating
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "", label: "All Ratings" },
                    { value: "4", label: "4 Stars & Up" },
                    { value: "3", label: "3 Stars & Up" },
                    { value: "2", label: "2 Stars & Up" },
                  ].map((rating) => (
                    <label
                      key={rating.value}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary-600"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating.value}
                        checked={filters.rating === rating.value}
                        onChange={(e) =>
                          handleFilterChange("rating", e.target.value)
                        }
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-600 font-medium">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"} Found
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">
                  Sort by:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="default">Default</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <span className="text-6xl mb-4 block">😔</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {paginatedProducts.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                {/* Previous Button */}
                <button
                  onClick={(e) => handlePreviousPage(e)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, index) =>
                  pageNum === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageClick(pageNum);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? "bg-primary-500 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}

                {/* Next Button */}
                <button
                  onClick={(e) => handleNextPage(e)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Store;
