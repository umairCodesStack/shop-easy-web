import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupVendor } from "../hooks/useSignupVendor";
import toast from "react-hot-toast";
import { getUserIdFromToken } from "../utils/jwtUtils";
import { useCreateStore } from "../hooks/useCreateStore";

const VendorRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const {
    signupAsync,
    error: signupError,
    isLoading: signUpLoading,
  } = useSignupVendor();
  const { createStore, isLoading: storeLoading } = useCreateStore();

  // Step 1: User Data
  const [userData, setUserData] = useState({
    Username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    agreeToTerms: false,
    role: "Vendor",
  });

  // Step 2: Store Data
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    address: "",
    isActive: true,
  });

  // Image states
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle User Data Change
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle Store Data Change
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle Logo Upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
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

      // Create preview (for display only)
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
      // Validate file
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

      // Create preview (for display only)
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
    setLogoPreview(null);
    setImageErrors((prev) => ({ ...prev, logo: null }));
    const fileInput = document.getElementById("logoFile");
    if (fileInput) fileInput.value = "";
  };

  // Remove Banner
  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setImageErrors((prev) => ({ ...prev, banner: null }));
    const fileInput = document.getElementById("bannerFile");
    if (fileInput) fileInput.value = "";
  };

  // Password Strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 33, text: "Weak", color: "bg-red-500" };
    if (strength <= 3)
      return { strength: 66, text: "Medium", color: "bg-yellow-500" };
    return { strength: 100, text: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(userData.password);

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!userData.Username.trim()) {
      newErrors.Username = "Full name is required";
    } else if (userData.Username.trim().length < 3) {
      newErrors.Username = "Name must be at least 3 characters";
    }

    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!userData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const newErrors = {};

    if (!storeData.name.trim()) {
      newErrors.name = "Store name is required";
    } else if (storeData.name.trim().length < 3) {
      newErrors.name = "Store name must be at least 3 characters";
    }

    if (
      storeData.phoneNumber &&
      !/^\+?[\d\s\-()]+$/.test(storeData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 1 Submit
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) return;

    try {
      const response = await signupAsync(userData);
      const extractedUserId = getUserIdFromToken(response.accessToken);

      if (!extractedUserId) {
        throw new Error("User ID not found in response");
      }

      setUserId(extractedUserId);
      setCurrentStep(2);
      setErrors({});

      toast.success("Account created! Setup your store now.");
    } catch (error) {
      setErrors({
        submit: error.message || "Registration failed. Please try again.",
      });
      toast.error(error.message || "Registration failed");
    }
  };

  // Handle Step 2 Submit - Send File objects directly
  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      const logo = logoFile || null;
      const banner = bannerFile || null;

      const storePayload = {
        name: storeData.name,
        description: storeData.description || "",
        ownerId: parseInt(userId),
        phoneNumber: storeData.phoneNumber || userData.phoneNumber || "",
        address: storeData.address || "",
        isActive: true,
        logo: logo,
        banner: banner,
      };

      console.log("📦 Store data:", {
        ...storePayload,
        logo: logo
          ? `File: ${logo.name} (${(logo.size / 1024).toFixed(2)} KB)`
          : "No logo",
        banner: banner
          ? `File: ${banner.name} (${(banner.size / 1024).toFixed(2)} KB)`
          : "No banner",
      });

      await createStore({
        ...storePayload,
        logo: logo,
        banner: banner,
      });
      console.log("✅ Store created successfully");
      toast.success("Store created successfully! 🎉");
      navigate("/vendor/dashboard");
    } catch (error) {
      console.error("❌ Store creation error:", error);

      let errorMessage = "Store creation failed. Please try again.";

      if (error.message.includes("JSON")) {
        errorMessage =
          "Server error. Please check your connection and try again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
  };

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

      {/* Registration Card */}
      <div className="w-full max-w-2xl relative z-10 my-8">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            <span className="text-3xl">🏪</span>
            <span className="text-2xl font-bold text-white">
              Vendor Registration
            </span>
          </Link>
        </div>

        {/* Main Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > 1 ? "✓" : "1"}
                </div>
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      currentStep >= 1 ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    Account
                  </p>
                  <p className="text-xs text-gray-500">Create your account</p>
                </div>
              </div>

              {/* Connector Line */}
              <div
                className={`h-1 flex-1 mx-4 rounded transition-all duration-300 ${
                  currentStep > 1 ? "bg-orange-500" : "bg-gray-200"
                }`}
              ></div>

              {/* Step 2 */}
              <div className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= 2
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      currentStep >= 2 ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    Store Info
                  </p>
                  <p className="text-xs text-gray-500">Setup your store</p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 1: User Registration */}
          {currentStep === 1 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Vendor Account 🎉
                </h1>
                <p className="text-gray-600">
                  Start your journey as a seller on Shop-Easy
                </p>
              </div>

              {/* Social Signup Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialSignup("google")}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9465L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm font-medium">
                  Or register with email
                </span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Step 1 Form */}
              <form onSubmit={handleStep1Submit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="Username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      👤
                    </span>
                    <input
                      type="text"
                      id="Username"
                      name="Username"
                      value={userData.Username}
                      onChange={handleUserChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.Username
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.Username && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.Username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      📧
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleUserChange}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      📱
                    </span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={handleUserChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      🔒
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={handleUserChange}
                      placeholder="Create a strong password"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="text-xl">
                        {showPassword ? "🙈" : "👁️"}
                      </span>
                    </button>
                  </div>

                  {/* Password Strength */}
                  {userData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength.text === "Weak"
                              ? "text-red-600"
                              : passwordStrength.text === "Medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {passwordStrength.text}
                        </span>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      🔐
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleUserChange}
                      placeholder="Confirm your password"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="text-xl">
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={userData.agreeToTerms}
                      onChange={handleUserChange}
                      className={`mt-1 w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer ${
                        errors.agreeToTerms ? "border-red-500" : ""
                      }`}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      I agree to the{" "}
                      <Link
                        to="/vendor/terms"
                        className="text-orange-600 font-semibold hover:text-orange-700"
                      >
                        Vendor Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-orange-600 font-semibold hover:text-orange-700"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={signUpLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {signUpLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span>Continue to Store Setup</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Store Information */}
          {currentStep === 2 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Setup Your Store 🏪
                </h1>
                <p className="text-gray-600">
                  Tell us about your store and start selling
                </p>
              </div>

              {/* Step 2 Form */}
              <form onSubmit={handleStep2Submit} className="space-y-5">
                {/* Store Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Store Name *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      🏪
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={storeData.name}
                      onChange={handleStoreChange}
                      placeholder="Enter your store name"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.name
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Store Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={storeData.description}
                    onChange={handleStoreChange}
                    placeholder="Describe your store and what you sell..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300 resize-none"
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
                          Click to upload logo
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
                          Click to upload banner
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

                {/* Store Phone */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Store Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      📞
                    </span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={storeData.phoneNumber}
                      onChange={handleStoreChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.phoneNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Store Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400 text-xl">
                      📍
                    </span>
                    <textarea
                      id="address"
                      name="address"
                      value={storeData.address}
                      onChange={handleStoreChange}
                      placeholder="Enter your store address"
                      rows="3"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || storeLoading}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading || storeLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Store...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Customer Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Want to shop instead?{" "}
              <Link
                to="/register"
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Customer Registration →
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors font-semibold"
          >
            <span>←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
