import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGetProductById from "../../hooks/useGetProductById";
import { updateProduct } from "../../services/productsApi";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Image states
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Size and Color tracking states (similar to images)
  const [originalSizes, setOriginalSizes] = useState([]);
  const [originalColors, setOriginalColors] = useState([]);
  const [sizesToRemove, setSizesToRemove] = useState([]);
  const [colorsToRemove, setColorsToRemove] = useState([]);

  // Size and Color input states
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    stock: "",
    sku: "",
    tags: "",
    sizes: [],
    colors: [],
    isActive: true,
  });

  const { data: fetchedProduct, error, isLoading } = useGetProductById(id);

  const categories = [
    "electronics",
    "clothing",
    "accessories",
    "home & garden",
    "sports",
    "books",
    "toys",
    "beauty",
    "fashion",
    "home",
  ];

  // Predefined tags
  const predefinedTags = [
    "New",
    "Hot",
    "Trending",
    "Best Seller",
    "Top Rated",
    "Popular",
    "50% OFF",
    "Hot Deal",
    "Limited Edition",
    "Flash Sale",
  ];

  // Predefined common sizes
  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Predefined common colors
  const commonColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#00FF00" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Purple", hex: "#800080" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Gray", hex: "#808080" },
  ];

  // Populate form data when product is fetched
  useEffect(() => {
    if (fetchedProduct && !isLoading) {
      const sizes = fetchedProduct.sizes || [];
      const colors = fetchedProduct.colors || [];

      setOriginalSizes(sizes);
      setOriginalColors(colors);

      setFormData({
        name: fetchedProduct.name || "",
        description: fetchedProduct.description || "",
        category: fetchedProduct.category || "",
        price: fetchedProduct.originalPrice || "",
        originalPrice: fetchedProduct.originalPrice || "",
        discount: fetchedProduct.discount || "",
        stock: fetchedProduct.stockQuantity || "",
        sku: fetchedProduct.sku || "",
        tags: fetchedProduct.tag || "",
        sizes: sizes,
        colors: colors,
        isActive: fetchedProduct.isActive ?? true,
      });
    }
  }, [fetchedProduct, isLoading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
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

  // Handle adding size
  const handleAddSize = (size) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));

      // If this size was marked for removal, unmark it
      if (sizesToRemove.includes(size)) {
        setSizesToRemove((prev) => prev.filter((s) => s !== size));
      }

      setSizeInput("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove),
    }));

    // If this was an original size, mark it for removal
    if (originalSizes.includes(sizeToRemove)) {
      setSizesToRemove((prev) => [...prev, sizeToRemove]);
    }
  };

  // Handle adding color
  const handleAddColor = (color) => {
    if (color && !formData.colors.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));

      // If this color was marked for removal, unmark it
      if (colorsToRemove.includes(color)) {
        setColorsToRemove((prev) => prev.filter((c) => c !== color));
      }

      setColorInput("");
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== colorToRemove),
    }));

    // If this was an original color, mark it for removal
    if (originalColors.includes(colorToRemove)) {
      setColorsToRemove((prev) => [...prev, colorToRemove]);
    }
  };

  // Handle removing existing images
  const handleRemoveExistingImage = (imageUrl) => {
    setImagesToRemove((prev) => [...prev, imageUrl]);
  };

  // Handle undo remove (restore image)
  const handleUndoRemove = (imageUrl) => {
    setImagesToRemove((prev) => prev.filter((url) => url !== imageUrl));
  };

  // Handle new image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Please select only image files (JPG, PNG, GIF, WebP)",
      }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Each image must be less than 5MB",
      }));
      return;
    }

    const existingCount =
      (fetchedProduct?.imageUrls?.length || 0) - imagesToRemove.length;
    const totalCount = existingCount + newImages.length + files.length;

    if (totalCount > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can have maximum 5 images total",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    setNewImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Remove new image (not yet uploaded)
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (
      formData.discount &&
      (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    const remainingImages =
      (fetchedProduct?.imageUrls?.length || 0) -
      imagesToRemove.length +
      newImages.length;
    if (remainingImages === 0) {
      newErrors.images = "At least one product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Calculate new sizes and colors (ones not in original)
      const newSizes = formData.sizes.filter(
        (size) => !originalSizes.includes(size),
      );
      const newColors = formData.colors.filter(
        (color) => !originalColors.includes(color),
      );

      const updatedData = {
        ...formData,
        imagesToRemove,
        newImages,
        sizesToRemove,
        newSizes,
        colorsToRemove,
        newColors,
      };

      // Call your update API here
      await updateProduct(id, updatedData);

      navigate("/vendor/products");
    } catch (error) {
      setErrors({ submit: "Failed to update product. Please try again." });
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
            <p className="text-gray-600 font-semibold">Loading Product...</p>
          </div>
        </div>
      </div>
    );
  }

  const existingImages = (fetchedProduct?.imageUrls || []).filter(
    (url) => !imagesToRemove.includes(url),
  );
  const totalImageCount = existingImages.length + newImages.length;

  const calculateFinalPrice = () => {
    if (!formData.price) return "0.00";
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount) || 0;
    const finalPrice = price - (price * discount) / 100;
    return finalPrice.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>✏️</span>
              Edit Product
            </h1>
            <p className="text-gray-600">Update product information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                  }`}
                />
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
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300 resize-none"
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.category
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Price, Discount & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Original Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.price
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Discount */}
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      step="1"
                      min="0"
                      max="100"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.discount
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      %
                    </span>
                  </div>
                  {errors.discount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.discount}
                    </p>
                  )}
                </div>

                {/* Stock Quantity */}
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.stock
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                    }`}
                  />
                  {errors.stock && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* Final Price Display */}
              {formData.price && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        Final Price After Discount:
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        ${calculateFinalPrice()}
                      </p>
                    </div>
                    {formData.discount && parseFloat(formData.discount) > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">
                          ${parseFloat(formData.price).toFixed(2)}
                        </p>
                        <span className="inline-block bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {formData.discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tag */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Tag (Optional)
                </label>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, tags: tag }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          formData.tags === tag
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Or enter custom tag"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sizes (Optional)
                </label>

                {/* Common Sizes Quick Add */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleAddSize(size)}
                        disabled={formData.sizes.includes(size)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          formData.sizes.includes(size)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Size Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSize(sizeInput))
                    }
                    placeholder="Add custom size (e.g., 32, 34, 36)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSize(sizeInput)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Sizes */}
                {formData.sizes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.sizes.map((size, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                          originalSizes.includes(size)
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700 border-2 border-green-400"
                        }`}
                      >
                        {!originalSizes.includes(size) && (
                          <span className="text-xs font-bold">NEW</span>
                        )}
                        {size}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(size)}
                          className="hover:text-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Sizes marked for removal */}
                {sizesToRemove.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-xs font-semibold text-red-700 mb-2">
                      {sizesToRemove.length} size(s) will be removed:{" "}
                      {sizesToRemove.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Colors (Optional)
                </label>

                {/* Common Colors Quick Add */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleAddColor(color.name)}
                        disabled={formData.colors.includes(color.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          formData.colors.includes(color.name)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        ></span>
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddColor(colorInput))
                    }
                    placeholder="Add custom color (e.g., Navy Blue, Forest Green)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddColor(colorInput)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Colors */}
                {formData.colors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                          originalColors.includes(color)
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700 border-2 border-green-400"
                        }`}
                      >
                        {!originalColors.includes(color) && (
                          <span className="text-xs font-bold">NEW</span>
                        )}
                        {color}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="hover:text-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Colors marked for removal */}
                {colorsToRemove.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-xs font-semibold text-red-700 mb-2">
                      {colorsToRemove.length} color(s) will be removed:{" "}
                      {colorsToRemove.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images *{" "}
                  {totalImageCount > 0 && `(${totalImageCount}/5)`}
                </label>

                {/* Upload Button */}
                <div className="mb-4">
                  <label
                    htmlFor="images"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                      errors.images
                        ? "border-red-500 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-orange-500"
                    } ${totalImageCount >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-2xl">📸</span>
                    <span className="font-semibold text-gray-700">
                      {totalImageCount === 0
                        ? "Upload Images"
                        : "Add More Images"}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={totalImageCount >= 5}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload up to 5 images • JPG, PNG, GIF, WebP • Max 5MB each •
                    Recommended: 800x800px
                  </p>
                </div>

                {/* Error Message */}
                {errors.images && (
                  <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.images}
                  </p>
                )}

                {/* Image Previews Grid */}
                {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-all duration-300"
                      >
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            Primary
                          </div>
                        )}

                        {/* Overlay with Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(url)}
                            className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300"
                            title="Remove image"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    ))}

                    {/* New Images */}
                    {newImagePreviews.map((url, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-green-400 hover:border-green-500 transition-all duration-300"
                      >
                        <img
                          src={url}
                          alt={`New ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* New Badge */}
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          NEW
                        </div>

                        {/* Overlay with Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300"
                            title="Remove image"
                          >
                            <svg
                              className="w-5 h-5"
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
                      </div>
                    ))}
                  </div>
                )}

                {/* Images marked for removal */}
                {imagesToRemove.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-700 mb-2">
                      {imagesToRemove.length} image(s) will be deleted:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {imagesToRemove.map((url, index) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-red-400"
                        >
                          <img
                            src={url}
                            alt="To delete"
                            className="w-full h-full object-cover opacity-50"
                          />
                          <button
                            type="button"
                            onClick={() => handleUndoRemove(url)}
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs hover:bg-opacity-70 transition-all"
                            title="Undo"
                          >
                            Undo
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Product is active
                </label>
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
              <div className="flex gap-4 pt-4">
                <Link
                  to="/vendor/products"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg text-center transition-all duration-300"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
