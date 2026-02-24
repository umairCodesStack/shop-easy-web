import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authApi";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";
import { useDeleteStore } from "../../hooks/useDeleteStore";

export default function VendorNavbar({ toggleSidebar, userData, storeData }) {
  const navigate = useNavigate();
  const { name, logoUrl, userId } = userData || {};
  const { name: storeName, logoUrl: storeLogo, id: storeId } = storeData || {};

  const {
    mutate: deleteStore,
    isLoading: deletingStore,
    error: deleteError,
  } = useDeleteStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteStore = () => {
    if (!storeId) {
      toast.error("Store ID missing");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to delete your store? This action cannot be undone.",
      )
    ) {
      deleteStore(storeId);
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    if (!showDropdown) return;
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🛍️</span>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hidden sm:inline">
                ShopEasy
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
              {storeLogo ? (
                <img
                  src={storeLogo}
                  alt={storeName || "Store"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-orange-300"
                />
              ) : (
                <span className="text-2xl">🏪</span>
              )}
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {storeName || name || "My Store"}
                </p>
                <p className="text-xs text-gray-500">Vendor Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right: Notifications + User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <span className="text-xl sm:text-2xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((open) => !open)}
                className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full focus:outline-none"
                aria-label="Open user menu"
              >
                <Avatar src={logoUrl} alt={name} size="md" fallbackIcon="👤" />
                <span className="text-sm font-semibold max-w-[100px] sm:max-w-[120px] truncate">
                  {name}
                </span>
                <svg
                  className={`w-4 h-4 ml-2 text-gray-600 transition-transform ${
                    showDropdown ? "rotate-180" : ""
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

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleDeleteStore}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-300"
                    disabled={deletingStore}
                  >
                    <span className="text-lg">🗑️</span>
                    <span>Delete Store</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-300"
                  >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                  </button>
                  {deleteError && (
                    <div className="text-xs text-red-500 px-4 pt-2">
                      {deleteError.message || "Failed to delete store"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
