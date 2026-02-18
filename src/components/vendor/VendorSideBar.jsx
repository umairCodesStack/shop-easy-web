import { Link, useLocation } from "react-router-dom";

function VendorSidebar({ closeSidebar }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: "/vendor/dashboard",
      icon: "📊",
      label: "Dashboard",
      description: "Overview & stats",
    },
    {
      path: "/vendor/products",
      icon: "📦",
      label: "Products",
      description: "Manage inventory",
    },
    {
      path: "/vendor/orders",
      icon: "🛒",
      label: "Orders",
      description: "View & process",
    },
    {
      path: "/vendor/analytics",
      icon: "📈",
      label: "Analytics",
      description: "Sales insights",
    },
    {
      path: "/vendor/store",
      icon: "⚙️",
      label: "Store Settings",
      description: "Configure store",
    },
  ];

  // Handle link click - close sidebar on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      closeSidebar?.();
    }
  };

  return (
    <aside className="w-64 bg-white shadow-xl lg:shadow-md h-full overflow-y-auto">
      <nav className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </h2>
          {/* Close button (Mobile Only) */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p
                    className={`text-xs ${
                      isActive(item.path) ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick Add Button */}
        <div className="mt-6 px-4">
          <Link
            to="/vendor/products/add"
            onClick={handleLinkClick}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="text-xl">➕</span>
            <span>Add Product</span>
          </Link>
        </div>

        {/* Store Info (Mobile Only) */}
        <div className="mt-6 px-4 py-4 bg-orange-50 rounded-lg border border-orange-200 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <p className="text-sm font-bold text-gray-900">My Store</p>
              <p className="text-xs text-gray-500">Vendor Dashboard</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default VendorSidebar;
