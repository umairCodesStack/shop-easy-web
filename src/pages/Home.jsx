import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { useTrendingProduct } from "../components/products/useTrendingProduct";
import useHotDealsProduct from "../components/products/useHotDealsProduct";
import useGetCategories from "../hooks/useGetCatagories";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "../utils/CatagoreyIcons";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

const Home = () => {
  const {
    data: trendingProducts,
    isLoading: isLoadingTrending,
    error: errorTrending,
  } = useTrendingProduct();
  const {
    data: hotDealsProduct,
    isLoading: isLoadingHotDeals,
    error: errorHotDeals,
  } = useHotDealsProduct();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useGetCategories();
  console.log("Categories from API:", categories);

  const categoriesData =
    categories?.map((categoryName) => {
      const cleanName = categoryName.toLowerCase().trim(); // Add .trim() here!
      console.log(
        "Mapping category:",
        categoryName,
        "Icon:",
        CATEGORY_ICONS[cleanName],
      );
      return {
        id: cleanName.replace(/\s+/g, "-"),
        name: categoryName.trim(), // Also trim the display name
        icon: CATEGORY_ICONS[cleanName] || DEFAULT_CATEGORY_ICON,
      };
    }) || [];
  // Top Vendors
  const topVendorsData = [
    {
      id: 1,
      name: "TechVault Store",
      description: "Premium electronics and gadgets",
      logo: "💻",
      rating: 4.8,
      totalProducts: 234,
      totalSales: 5420,
    },
    {
      id: 2,
      name: "Fashion Gallery",
      description: "Trendy fashion for everyone",
      logo: "👗",
      rating: 4.7,
      totalProducts: 567,
      totalSales: 8920,
    },
    {
      id: 3,
      name: "Sports Arena",
      description: "Quality sports equipment",
      logo: "⚽",
      rating: 4.9,
      totalProducts: 189,
      totalSales: 3210,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
                <span className="text-2xl">🎉</span>
                <span className="font-semibold text-sm">
                  Welcome to Shop-Easy
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Shop from <span className="text-yellow-300">1000+ Vendors</span>
                <br />
                One Platform
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Discover millions of products from trusted sellers worldwide.
                Great deals, fast shipping, and secure checkout.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <span>🛍️</span>
                  Shop Now
                </Link>
                <Link
                  to="/stores"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  <span>🏪</span>
                  Browse Stores
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    1000+
                  </div>
                  <div className="text-sm text-white/80">Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-white/80">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    100K+
                  </div>
                  <div className="text-sm text-white/80">Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION - NO BORDERS, SEAMLESS */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">
                Browse through your favorite categories
              </p>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2">
                {categoriesData.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.name.toLowerCase()}`}
                    className="flex-shrink-0 group"
                  >
                    <div className="flex items-center gap-3 bg-white hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-full px-6 py-3 shadow-sm hover:shadow-lg transition-all duration-300">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </span>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm whitespace-nowrap group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h3>
                        {/* <p className="text-xs text-gray-500">
                        {category.count.toLocaleString()}
                      </p> */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* TRENDING PRODUCTS SECTION */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-4xl">🔥</span>
                  Trending Products
                </h2>
                <p className="text-gray-600 text-lg">
                  Most popular items this week
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-4 transition-all duration-300 group"
              >
                View All Products
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingTrending ? (
                // Show skeleton cards while loading
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : errorTrending ? (
                <div className="col-span-full text-center text-red-500 py-12">
                  <p className="text-lg font-semibold mb-2">
                    Failed to load trending products.
                  </p>
                  <p className="text-sm">Please try again later.</p>
                </div>
              ) : trendingProducts?.length > 0 ? (
                trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  <p className="text-lg">
                    No trending products available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TOP VENDORS SECTION */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-4xl">🏪</span>
                  Featured Stores
                </h2>
                <p className="text-gray-600 text-lg">
                  Shop from top-rated vendors
                </p>
              </div>
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-4 transition-all duration-300 group"
              >
                View All Stores
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topVendorsData.map((vendor) => (
                <Link
                  key={vendor.id}
                  to={`/stores/${vendor.id}`}
                  className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-500"
                >
                  {/* Vendor Logo */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {vendor.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {vendor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {vendor.description}
                      </p>
                    </div>
                  </div>

                  {/* Vendor Stats */}
                  <div className="flex justify-around items-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span>⭐</span>
                        <span className="font-bold text-gray-900">
                          {vendor.rating}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900 mb-1">
                        {vendor.totalProducts}
                      </div>
                      <div className="text-xs text-gray-500">Items</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900 mb-1">
                        {vendor.totalSales.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Sales</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* DEALS OF THE DAY SECTION */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-4xl">⚡</span>
                  Today's Hot Deals
                </h2>
                <p className="text-gray-600 text-lg">
                  Limited time offers - Don't miss out!
                </p>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600 mb-1">Ends in:</div>
                <div className="text-2xl font-bold text-red-600">23:45:12</div>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingHotDeals ? (
                // Show skeleton cards while loading
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : errorHotDeals ? (
                <div className="col-span-full text-center text-red-500 py-12">
                  <p className="text-lg font-semibold mb-2">
                    Failed to load hot deals.
                  </p>
                  <p className="text-sm">Please try again later.</p>
                </div>
              ) : hotDealsProduct && hotDealsProduct.length > 0 ? (
                hotDealsProduct.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  <p className="text-lg">
                    No hot deals available at the moment.
                  </p>
                  <p className="text-sm">Please check back later.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Why Shop With Us?
              </h2>
              <p className="text-gray-600 text-lg">
                We provide the best shopping experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  🚚
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Free Shipping
                </h3>
                <p className="text-gray-600">
                  Free delivery on orders over $50. Fast and reliable shipping
                  worldwide.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure Payment
                </h3>
                <p className="text-gray-600">
                  100% secure payment processing. Your data is protected with
                  SSL encryption.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  ↩️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Easy Returns
                </h3>
                <p className="text-gray-600">
                  30-day hassle-free return policy. Not satisfied? Get your
                  money back.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  💬
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Round-the-clock customer support. We're here to help anytime
                  you need.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
