import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/cartContext";
// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./components/products/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CartPage from "./pages/CartPage";

// Vendor Protected Pages
import AddProduct from "./pages/AddProduct";
import EditProduct from "./components/products/EditProduct";
import VendorOrders from "./components/vendor/VendorOrders";
import VendorLayout from "./components/vendor/VendorLayout";
import VendorProtectedRoute from "./pages/VendorProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProtectedCheckoutRoute from "./pages/ProtectedCheckoutRoute";
import VendorRegister from "./components/vendor/VendorRegister";
import Orders from "./pages/Orders";
import StoresPage from "./pages/StoresPage";
import AdminPage from "./pages/AdminPage";
import ProtectedAdminRoute from "./pages/ProtectedAdminRoute";
import Store from "./pages/Store";
import VendorDashboard from "./components/vendor/VendorDashboard";
import VendorProducts from "./components/vendor/VendorProduts";
import VendorAnalytics from "./components/vendor/VendorAnalytics";
import VendorStoreSettings from "./components/vendor/VendorStoreSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <CartProvider>
          <Routes>
            {/* Public Routes with Layout (Navbar + Footer) */}

            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/store/:id" element={<Store />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedCheckoutRoute>
                  <CheckoutPage />
                </ProtectedCheckoutRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            {/* Customer Protected Routes */}
            <Route path="/cart" element={<CartPage />} />

            {/* Vendor Protected Routes with Vendor Layout */}
            <Route
              path="/vendor"
              element={
                <VendorProtectedRoute>
                  <VendorLayout />
                </VendorProtectedRoute>
              }
            >
              <Route path="dashboard" element={<VendorDashboard />} />

              <Route path="products" element={<VendorProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<VendorOrders />} />
              <Route path="analytics" element={<VendorAnalytics />} />
              <Route path="store" element={<VendorStoreSettings />} />
            </Route>

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                      404
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                    <a
                      href="/"
                      className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </CartProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
