import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const VendorSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate("/vendor/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4 relative overflow-hidden">
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

      {/* Success Card */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-5xl">✓</span>
            </div>
            <div className="text-6xl mb-4">🎉</div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your vendor account has been created successfully!
          </p>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-8 border-2 border-orange-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              What's Next? 🚀
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">1️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Add Products
                  </h3>
                  <p className="text-sm text-gray-600">
                    Start listing your products to sell
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">2️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Customize Store
                  </h3>
                  <p className="text-sm text-gray-600">
                    Personalize your store appearance
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">3️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Start Selling
                  </h3>
                  <p className="text-sm text-gray-600">
                    Begin receiving orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vendor/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>🏪</span>
              Go to Dashboard
            </Link>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            >
              <span>➕</span>
              Add Your First Product
            </Link>
          </div>

          {/* Auto Redirect Notice */}
          <p className="text-sm text-gray-500 mt-6">
            You will be automatically redirected to the dashboard in 5
            seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorSuccess;
