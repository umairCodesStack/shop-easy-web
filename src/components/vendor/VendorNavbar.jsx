import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authApi";
import toast from "react-hot-toast";
import { getUserData } from "../../utils/jwtUtils";
import Avatar from "../common/Avatar";
import { getItemWithExpiry } from "../../utils/localStorageUtils";
import { use } from "react";
import useGetStore from "../../hooks/useGetStore";
function VendorNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const userData = getUserData();
  const { name, logoUrl, userId } = userData || {};
  const { storeData, error, isLoading } = useGetStore(userId);
  console.log(
    "🔍 Store data in Navbar:",
    storeData,
    "Error:",
    error,
    "Loading:",
    isLoading,
  );
  const { name: storeName, logoUrl: storeLogo } = storeData || {};

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Menu Button (Mobile Only) */}
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

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🛍️</span>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hidden sm:inline">
                {"ShopEasy"}
              </span>
            </Link>

            {/* Store Name (Desktop Only) */}
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

          {/* Right: Notifications + User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <span className="text-xl sm:text-2xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full">
              <Avatar src={logoUrl} alt={name} size="md" fallbackIcon="👤" />
              <span className="text-sm font-semibold max-w-[100px] sm:max-w-[120px] truncate">
                {name}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-semibold text-xs sm:text-sm transition-colors px-2 sm:px-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default VendorNavbar;
