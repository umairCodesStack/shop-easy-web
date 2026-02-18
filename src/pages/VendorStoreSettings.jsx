import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUpdateStore } from "../hooks/useUpdateStore";
import toast from "react-hot-toast";
import useGetStore from "../hooks/useGetStore";
import { getUserData } from "../utils/jwtUtils";

const VendorStoreSettings = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  const userData = getUserData();
  const { name, logoUrl, userId } = userData || {};
  const { storeData: fetchedStoreData, error, isLoading } = useGetStore(userId);
  const { updateStore, isLoading: isUpdating } = useUpdateStore();

  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    phoneNumber: "",
    address: "",
    isActive: true,
    id: null,
    approvalStatus: "", // Add this
  });

  // Image states
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

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

  // Load store data when fetched
  useEffect(() => {
    if (fetchedStoreData) {
      console.log("📦 Fetched Store Data:", fetchedStoreData);
      console.log("🆔 Store ID:", fetchedStoreData.id);

      setStoreData({
        name: fetchedStoreData.name || "",
        description: fetchedStoreData.description || "",
        logoUrl: fetchedStoreData.logoUrl || "",
        bannerUrl: fetchedStoreData.bannerUrl || "",
        phoneNumber: fetchedStoreData.phoneNumber || "",
        address: fetchedStoreData.address || "",
        isActive: fetchedStoreData.isActive ?? true,
        id: fetchedStoreData.id || null,
        approvalStatus: fetchedStoreData.approvalStatus || "Pending", // Add this
      });

      // Set preview for existing images
      if (fetchedStoreData.logoUrl) {
        setLogoPreview(fetchedStoreData.logoUrl);
      }
      if (fetchedStoreData.bannerUrl) {
        setBannerPreview(fetchedStoreData.bannerUrl);
      }
    }
  }, [fetchedStoreData]);

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

  // Handle Logo Upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageErrors((prev) => ({
          ...prev,
          logo: "Please select an image file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageErrors((prev) => ({
          ...prev,
          logo: "Image must be less than 5MB",
        }));
        return;
      }

      setLogoFile(file);
      setImageErrors((prev) => ({ ...prev, logo: null }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Upload
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageErrors((prev) => ({
          ...prev,
          banner: "Please select an image file",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setImageErrors((prev) => ({
          ...prev,
          banner: "Image must be less than 10MB",
        }));
        return;
      }

      setBannerFile(file);
      setImageErrors((prev) => ({ ...prev, banner: null }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Logo
  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(storeData.logoUrl || null);
    setImageErrors((prev) => ({ ...prev, logo: null }));
    const fileInput = document.getElementById("logoFile");
    if (fileInput) fileInput.value = "";
  };

  // Remove Banner
  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(storeData.bannerUrl || null);
    setImageErrors((prev) => ({ ...prev, banner: null }));
    const fileInput = document.getElementById("bannerFile");
    if (fileInput) fileInput.value = "";
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Current storeData:", storeData);
    console.log("🆔 Store ID being sent:", storeData.id);

    if (!storeData.id) {
      toast.error("Store ID is missing!");
      console.error("❌ No store ID found in storeData");
      return;
    }

    try {
      const updatePayload = {
        ...storeData,
        logo: logoFile,
        banner: bannerFile,
      };

      console.log("📦 Update payload:", {
        id: updatePayload.id,
        name: updatePayload.name,
        logo: logoFile ? "File selected" : "No new logo",
        banner: bannerFile ? "File selected" : "No new banner",
      });

      await updateStore(updatePayload);
      toast.success("Store settings updated successfully!");

      // Reset file inputs
      setLogoFile(null);
      setBannerFile(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update store settings");
    }
  };
  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement owner update
    toast.success("Account information updated successfully!");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    // TODO: Implement password update
    toast.success("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === "general"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                🏪 Store Info
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === "account"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                👤 Account
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
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
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
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

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Logo
                    </label>

                    {!logoPreview ? (
                      <div className="relative">
                        <input
                          type="file"
                          id="logoFile"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="logoFile"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 transition-colors bg-gray-50 hover:bg-orange-50"
                        >
                          <span className="text-4xl mb-2">🖼️</span>
                          <span className="text-sm font-semibold text-gray-700">
                            Click to upload new logo
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Recommended: 200x200px (Max 5MB)
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-full h-40 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {imageErrors.logo && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {imageErrors.logo}
                      </p>
                    )}
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Banner
                    </label>

                    {!bannerPreview ? (
                      <div className="relative">
                        <input
                          type="file"
                          id="bannerFile"
                          accept="image/*"
                          onChange={handleBannerChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="bannerFile"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 transition-colors bg-gray-50 hover:bg-orange-50"
                        >
                          <span className="text-4xl mb-2">🎨</span>
                          <span className="text-sm font-semibold text-gray-700">
                            Click to upload new banner
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Recommended: 1200x300px (Max 10MB)
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-full h-48 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeBanner}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {imageErrors.banner && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {imageErrors.banner}
                      </p>
                    )}
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
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={storeData.address}
                      onChange={handleStoreChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    ></textarea>
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
                    disabled={isUpdating}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Store Settings"
                    )}
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
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Save Account Information
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
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Update Password
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
