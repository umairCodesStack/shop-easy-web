import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const VendorStoreSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isActive: true,
  });

  const [ownerData, setOwnerData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Fetch store data
    const fetchStoreData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        setStoreData({
          name: "TechVault Store",
          description: "Premium electronics and gadgets for tech enthusiasts",
          logoUrl: "https://via.placeholder.com/200",
          bannerUrl: "https://via.placeholder.com/1200x300",
          phoneNumber: "+1 (555) 123-4567",
          email: "contact@techvault.com",
          address: "123 Tech Street",
          city: "San Francisco",
          state: "CA",
          zipCode: "94102",
          country: "United States",
          isActive: true,
        });

        setOwnerData({
          fullName: "John Vendor",
          email: "john@techvault.com",
          phoneNumber: "+1 (555) 987-6543",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleStoreChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoreData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Your update store API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Store Data:", storeData);
      alert("Store settings updated successfully!");
    } catch (error) {
      setErrors({ submit: "Failed to update store settings" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Owner Data:", ownerData);
      alert("Account information updated successfully!");
    } catch (error) {
      setErrors({ submit: "Failed to update account information" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Password changed");
      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setErrors({ submit: "Failed to update password" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl">🛍️</span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Shop-Easy
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading Settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl">🛍️</span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Shop-Easy
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Link
                  to="/vendor/dashboard"
                  className="hover:text-orange-600 transition-colors"
                >
                  Dashboard
                </Link>
                <span>→</span>
                <span className="text-gray-900 font-semibold">
                  Store Settings
                </span>
              </div>
            </div>

            <Link
              to="/vendor/dashboard"
              className="text-gray-700 hover:text-orange-600 font-semibold text-sm transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>⚙️</span>
              Store Settings
            </h1>
            <p className="text-gray-600">
              Manage your store information and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "general"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                🏪 Store Info
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "account"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                👤 Account
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "security"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                🔒 Security
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Store Info Tab */}
              {activeTab === "general" && (
                <form onSubmit={handleStoreSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Store Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={storeData.name}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={storeData.email}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={storeData.description}
                      onChange={handleStoreChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Logo & Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="url"
                        name="logoUrl"
                        value={storeData.logoUrl}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Banner URL
                      </label>
                      <input
                        type="url"
                        name="bannerUrl"
                        value={storeData.bannerUrl}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={storeData.phoneNumber}
                      onChange={handleStoreChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={storeData.address}
                      onChange={handleStoreChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={storeData.city}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={storeData.state}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={storeData.zipCode}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={storeData.isActive}
                      onChange={handleStoreChange}
                      className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label className="text-sm font-semibold text-gray-700">
                      Store is active and visible to customers
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Store Settings"}
                  </button>
                </form>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <form onSubmit={handleOwnerSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={ownerData.fullName}
                      onChange={handleOwnerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={ownerData.email}
                      onChange={handleOwnerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={ownerData.phoneNumber}
                      onChange={handleOwnerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Account Information"}
                  </button>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStoreSettings;
