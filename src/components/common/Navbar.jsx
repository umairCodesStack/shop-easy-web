import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogin = () => {
    // TODO: Implement actual login logic
    alert("Login functionality - Connect to your backend");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out successfully");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-4xl">🛍️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Shop-Easy
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more..."
                className="w-full px-6 py-3 pr-12 border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
            >
              Products
            </Link>
            <Link
              to="/stores"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
            >
              Stores
            </Link>

            {/* Become a Vendor Button - NEW */}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 bg-gray-100 hover:bg-primary-50 px-4 py-2 rounded-full">
                <span className="text-2xl">🛒</span>
                <span className="font-medium hidden xl:inline">Cart</span>
                {/* Cart Badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Login/User Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
                  <span className="text-2xl">👤</span>
                  <span className="font-medium text-primary-700">User</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Login
              </NavLink>
            )}
            <Link
              to="/vendor/register"
              className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>🏪</span>
              <span>Sell</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600"
          >
            {isMobileMenuOpen ? (
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
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-full transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={toggleMobileMenu}
              className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors duration-300"
            >
              Products
            </Link>
            <Link
              to="/stores"
              onClick={toggleMobileMenu}
              className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors duration-300"
            >
              Stores
            </Link>

            {/* Become a Vendor - Mobile - NEW */}
            <Link
              to="/vendor/register"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md"
            >
              <span className="text-xl">🏪</span>
              <span>Become a Vendor</span>
            </Link>

            <Link
              to="/cart"
              onClick={toggleMobileMenu}
              className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors duration-300"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Login/Logout */}
            <div className="pt-3 border-t border-gray-200">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-lg mb-2">
                    <span className="text-2xl">👤</span>
                    <span className="font-medium text-primary-700">
                      User Account
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors duration-300"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
