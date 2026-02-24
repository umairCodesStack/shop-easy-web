import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUpdateStore } from "../../hooks/useUpdateStore";
import toast from "react-hot-toast";
import useGetStore from "../../hooks/useGetStore";
import { getUserData } from "../../utils/jwtUtils";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useGetUser } from "../../hooks/useGetUser";
import { useUpdateUserPassword } from "../../hooks/useUpdateUserPassword";

const VendorStoreSettings = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  const userData = getUserData();
  const { userId } = userData || {};

  const { storeData: fetchedStoreData, error, isLoading } = useGetStore(userId);
  const { updateStore, isLoading: isUpdating } = useUpdateStore();

  // Fetch full user data from API
  const { user: fetchedUserData, isLoading: isUserLoading } = useGetUser(
    userData?.email,
  );

  const {
    updateUser,
    error: updateError,
    isLoading: isUpdatingOwner,
  } = useUpdateUser();

  const [draftStoreData, setDraftStoreData] = useState({});

  // Image states
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Track if user wants to explicitly remove images
  const [removedLogo, setRemovedLogo] = useState(false);
  const [removedBanner, setRemovedBanner] = useState(false);

  // UI state for enabling edit mode for images
  const [isEditingImages, setIsEditingImages] = useState(false);
  const { updateUserPassword, isLoading: isUpdatingPassword } =
    useUpdateUserPassword();

  // Use direct state for owner data instead of useMemo
  const [ownerData, setOwnerData] = useState({
    id: userData?.userId || null,
    name: userData?.name || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
  });

  // Update ownerData ONLY when fetchedUserData initially loads
  useEffect(() => {
    if (fetchedUserData && !isUserLoading) {
      setOwnerData({
        id: fetchedUserData.id || userData?.userId,
        name: fetchedUserData.name || "",
        email: fetchedUserData.email || "",
        phoneNumber: fetchedUserData.phoneNumber || "",
      });
    }
  }, [fetchedUserData, isUserLoading]); // Removed userData from dependencies

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const baseStoreData = useMemo(() => {
    return {
      name: fetchedStoreData?.name ?? "",
      description: fetchedStoreData?.description ?? "",
      logoUrl: fetchedStoreData?.logoUrl ?? "",
      bannerUrl: fetchedStoreData?.bannerUrl ?? "",
      phoneNumber: fetchedStoreData?.phoneNumber ?? "",
      address: fetchedStoreData?.address ?? "",
      isActive: fetchedStoreData?.isActive ?? true,
      id: fetchedStoreData?.id ?? null,
      approvalStatus: fetchedStoreData?.approvalStatus ?? "Pending",
    };
  }, [fetchedStoreData]);

  const storeData = useMemo(() => {
    return { ...baseStoreData, ...draftStoreData };
  }, [baseStoreData, draftStoreData]);

  // Show preview if new file selected, otherwise show server URL (unless explicitly removed)
  const effectiveLogoPreview = removedLogo
    ? null
    : (logoPreview ?? storeData.logoUrl ?? null);
  const effectiveBannerPreview = removedBanner
    ? null
    : (bannerPreview ?? storeData.bannerUrl ?? null);

  const handleStoreChange = (e) => {
    const { name, value, type, checked } = e.target;

    setDraftStoreData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;

    // Map 'fullName' input to 'name' in ownerData
    const fieldName = name === "fullName" ? "name" : name;

    setOwnerData((prev) => {
      const updated = { ...prev, [fieldName]: value };
      return updated;
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    setRemovedLogo(false);
    setImageErrors((prev) => ({ ...prev, logo: null }));

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    setRemovedBanner(false);
    setImageErrors((prev) => ({ ...prev, banner: null }));

    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setRemovedLogo(true);
    setImageErrors((prev) => ({ ...prev, logo: null }));
    const fileInput = document.getElementById("logoFile");
    if (fileInput) fileInput.value = "";
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setRemovedBanner(true);
    setImageErrors((prev) => ({ ...prev, banner: null }));
    const fileInput = document.getElementById("bannerFile");
    if (fileInput) fileInput.value = "";
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();

    if (!storeData.id) {
      toast.error("Store ID is missing!");
      return;
    }

    try {
      const formData = {
        id: storeData.id,
        name: storeData.name,
        description: storeData.description || "",
        phoneNumber: storeData.phoneNumber || "",
        address: storeData.address || "",
        isActive: storeData.isActive,
        approvalStatus: storeData.approvalStatus || "Pending",
      };

      // Handle logo - ALWAYS include logoUrl
      if (removedLogo) {
        formData.logoUrl = "";
      } else {
        formData.logoUrl = storeData.logoUrl || "";
        if (logoFile) {
          formData.logo = logoFile;
        }
      }

      // Handle banner - ALWAYS include bannerUrl
      if (removedBanner) {
        formData.bannerUrl = "";
      } else {
        formData.bannerUrl = storeData.bannerUrl || "";
        if (bannerFile) {
          formData.banner = bannerFile;
        }
      }

      await updateStore(formData);
      toast.success("Store settings updated successfully!");

      setDraftStoreData({});
      setLogoFile(null);
      setBannerFile(null);
      setLogoPreview(null);
      setBannerPreview(null);
      setRemovedLogo(false);
      setRemovedBanner(false);
      setIsEditingImages(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update store settings");
    }
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!ownerData.id) {
        toast.error("User ID is missing!");
        return;
      }

      // Build payload - always include all fields
      const updatePayload = {
        id: ownerData.id,
        name: ownerData.name || "",
        email: ownerData.email || "",
        phoneNumber: ownerData.phoneNumber || "",
      };

      await updateUser(updatePayload);

      toast.success("Account information updated successfully!");
    } catch (err) {
      console.error("❌ Update account error:", err);
      console.error("Error details:", err.response?.data);
      toast.error(err?.message || "Failed to update account information");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    try {
      await updateUserPassword({
        email: ownerData.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      //toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err) {
      console.error("❌ Update password error:", err);
      toast.error(err?.message || "Failed to update password");
    }
  };

  if (isLoading || isUserLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load store
            </h2>
            <p className="text-gray-700">
              {error?.message ||
                "Something went wrong while fetching store data."}
            </p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Store Settings
            </h1>
            <p className="text-gray-600">
              Manage your store information and preferences
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Banner + Logo section */}
            <div className="relative">
              {/* Banner background */}
              <div
                className="h-56 sm:h-64 w-full bg-gray-200"
                style={{
                  backgroundImage: effectiveBannerPreview
                    ? `url(${effectiveBannerPreview})`
                    : "linear-gradient(90deg, rgba(249,115,22,1), rgba(239,68,68,1))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Edit button (top right on banner) */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingImages((v) => !v)}
                  className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg shadow font-semibold transition"
                >
                  {isEditingImages ? "Done" : "Edit Photos"}
                </button>
              </div>

              {/* Store name and status */}
              <div className="absolute left-6 sm:left-10 top-4">
                <p className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                  {storeData.name || "Your Store"}
                </p>
                <p className="text-white/90 text-sm drop-shadow-lg">
                  Status:{" "}
                  <span className="font-semibold">
                    {storeData.approvalStatus || "Pending"}
                  </span>
                </p>
              </div>

              {/* Logo circle */}
              <div className="absolute left-6 sm:left-10 -bottom-12 sm:-bottom-14">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                    {effectiveLogoPreview ? (
                      <img
                        src={effectiveLogoPreview}
                        alt="Store logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🏪</span>
                    )}
                  </div>

                  {isEditingImages && (
                    <label
                      htmlFor="logoFile"
                      className="absolute -right-1 -bottom-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 shadow cursor-pointer"
                      title="Change logo"
                    >
                      ✎
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              id="logoFile"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              disabled={!isEditingImages}
            />
            <input
              type="file"
              id="bannerFile"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              disabled={!isEditingImages}
            />

            {/* Photo edit controls */}
            {isEditingImages && (
              <div className="px-6 sm:px-10 pt-16 sm:pt-18 pb-6 border-b border-gray-200 bg-white">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-700">
                    Update your store banner and logo. Changes will be saved
                    when you click{" "}
                    <span className="font-semibold">Save Store Settings</span>.
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="bannerFile"
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 cursor-pointer text-sm"
                    >
                      Change Banner
                    </label>
                    <label
                      htmlFor="logoFile"
                      className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 cursor-pointer text-sm"
                    >
                      Change Logo
                    </label>

                    {effectiveBannerPreview && (
                      <button
                        type="button"
                        onClick={removeBanner}
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 text-sm"
                      >
                        Remove Banner
                      </button>
                    )}
                    {effectiveLogoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 text-sm"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>

                {(imageErrors.logo || imageErrors.banner) && (
                  <div className="mt-3 space-y-1">
                    {imageErrors.logo && (
                      <p className="text-sm text-red-600">{imageErrors.logo}</p>
                    )}
                    {imageErrors.banner && (
                      <p className="text-sm text-red-600">
                        {imageErrors.banner}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto pt-16 sm:pt-18">
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

            {/* Content */}
            <div className="p-8">
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
                    />
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
                    />
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
                    {isUpdating ? "Saving..." : "Save Store Settings"}
                  </button>
                </form>
              )}

              {activeTab === "account" && (
                <form onSubmit={handleOwnerSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={ownerData.name || ""}
                      onChange={handleOwnerChange}
                      disabled={isUpdatingOwner}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={ownerData.email || ""}
                      onChange={handleOwnerChange}
                      disabled={isUpdatingOwner}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={ownerData.phoneNumber || ""}
                      onChange={handleOwnerChange}
                      disabled={isUpdatingOwner}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingOwner}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingOwner ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </span>
                    ) : (
                      "Save Account Information"
                    )}
                  </button>
                </form>
              )}

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
