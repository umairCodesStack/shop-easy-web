import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/cartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VendorRegister from "./pages/VendorRegister";
import VendorDashboard from "./pages/VendorDashboard";
import VendorSuccess from "./pages/VendorSuccess";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import VendorProducts from "./pages/VendoProduts";
import VendorOrders from "./pages/VendorOrders";
import VendorAnalytics from "./pages/VendorAnalytics";
import VendorStoreSettings from "./pages/VendorStoreSettings";
import { Toaster } from "react-hot-toast";

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
          <div className="App flex flex-col min-h-screen">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/vendor/register" element={<VendorRegister />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/success" element={<VendorSuccess />} />
                <Route path="/vendor/products" element={<VendorProducts />} />
                <Route path="/vendor/products/add" element={<AddProduct />} />
                <Route
                  path="/vendor/products/edit/:id"
                  element={<EditProduct />}
                />
                <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route path="/vendor/analytics" element={<VendorAnalytics />} />
                <Route path="/vendor/store" element={<VendorStoreSettings />} />
                {/* Add more routes later */}
              </Routes>
            </main>
          </div>
        </CartProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
