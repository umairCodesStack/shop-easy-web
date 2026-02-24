import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { getUserData } from "../../utils/jwtUtils";
import { logout } from "../../services/authApi";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Get user data on component mount and when auth state changes
  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserDropdown(false);
      setUserData(null);
      navigate("/login");
      // Optional: You might not need window.location.reload() if you manage state properly
      // window.location.reload();
    } catch (error) {
      // Still navigate to login even if logout fails
      navigate("/login");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
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

            {/* User Section */}
            {userData ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-full transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {getUserInitial(userData.name)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500">{userData.role}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {userData.name}
                      </p>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                        {userData.role}
                      </span>
                    </div>
                    {/* <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span>👤</span>
                        <span>My Profile</span>
                      </div>
                    </Link> */}

                    {userData.role === "Vendor" ? (
                      <Link
                        to="/vendor/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span>🏪</span>
                          <span>Vendor Dashboard</span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        to="/my-orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span>📦</span>
                          <span>My Orders</span>
                        </div>
                      </Link>
                    )}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span>🚪</span>
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Login
              </NavLink>
            )}

            {/* Become a Vendor Button - Show only if not a vendor */}
            {(!userData || userData.role !== "Vendor") && (
              <Link
                to="/vendor/register"
                className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>🏪</span>
                <span>Sell</span>
              </Link>
            )}
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

            {/* Become a Vendor - Mobile - Show only if not a vendor */}
            {(!userData || userData.role !== "Vendor") && (
              <Link
                to="/vendor/register"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md"
              >
                <span className="text-xl">🏪</span>
                <span>Become a Vendor</span>
              </Link>
            )}

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

            {/* Mobile User Section */}
            <div className="pt-3 border-t border-gray-200">
              {userData ? (
                <>
                  <div className="px-4 py-3 bg-primary-50 rounded-lg mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {getUserInitial(userData.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {userData.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-1 bg-primary-200 text-primary-800 text-xs font-semibold rounded">
                      {userData.role}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  >
                    <span className="text-xl">👤</span>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  >
                    <span className="text-xl">📦</span>
                    <span>My Orders</span>
                  </Link>

                  {userData.role === "Vendor" && (
                    <Link
                      to="/vendor/dashboard"
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <span className="text-xl">🏪</span>
                      <span>Vendor Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-300 mt-2"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
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

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
