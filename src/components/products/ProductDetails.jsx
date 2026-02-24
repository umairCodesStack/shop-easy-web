import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGetProductById from "../../hooks/useGetProductById";
import { useCart } from "../../context/cartContext";
import Navbar from "../common/Navbar";

// Helper function to get color name from hex value
const getColorName = (hex) => {
  const colorMap = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#C0C0C0": "Silver",
    "#808080": "Gray",
    "#FF0000": "Red",
    "#0000FF": "Blue",
    "#00FF00": "Green",
    "#FFFF00": "Yellow",
    "#FFA500": "Orange",
    "#800080": "Purple",
    "#FFC0CB": "Pink",
    "#A52A2A": "Brown",
    "#FFD700": "Gold",
    "#00FFFF": "Cyan",
    "#FF00FF": "Magenta",
    "#0066CC": "Blue",
    "#CC0000": "Red",
    "#D4C5B9": "Beige",
    "#1E3A8A": "Navy",
    "#EC4899": "Pink",
    "#92400E": "Brown",
    "#6B7280": "Gray",
  };

  return colorMap[hex.toUpperCase()] || hex;
};

// Helper function to convert hex array to color objects
const convertColorsToObjects = (colorsArray) => {
  if (!colorsArray || colorsArray.length === 0) return [];

  return colorsArray.map((hex) => ({
    name: getColorName(hex),
    hex: hex,
  }));
};

// Helper function to generate mock sizes based on category
const getMockSizes = (category) => {
  const categoryLower = category?.toLowerCase().trim();

  if (categoryLower === "fashion") {
    return ["XS", "S", "M", "L", "XL", "XXL"];
  }

  // No sizes for electronics, home, etc.
  return [];
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  const { data: apiProduct, isLoading, error } = useGetProductById(id);

  // Merge API data with mock data for sections not yet available in API
  const product = apiProduct
    ? {
        ...apiProduct,
        price: apiProduct.finalPrice,
        images: apiProduct.imageUrls || [],
        inStock: apiProduct.stockQuantity > 0,
        stockCount: apiProduct.stockQuantity,

        // Convert API colors from hex strings to objects
        colors: convertColorsToObjects(apiProduct.colors),

        // Use API sizes if available, otherwise use mock sizes
        sizes:
          apiProduct.sizes && apiProduct.sizes.length > 0
            ? apiProduct.sizes
            : getMockSizes(apiProduct.category),

        // Mock data for store (until API provides it)
        storeId: apiProduct.storeId,
        storeRating: 4.8,
        //soldCount: Math.floor(Math.random() * 5000) + 1000,
        totalReviews: apiProduct.reviewsCount || 234,

        // Mock expanded description and features
        expandedDescription:
          apiProduct.description ||
          "This is a premium quality product designed to meet your needs. Perfect for everyday use with excellent durability and performance.",

        features: [
          "High-quality materials and construction",
          "Durable and long-lasting",
          "Easy to use and maintain",
          "Excellent value for money",
          "Backed by manufacturer warranty",
        ],

        // Mock specifications
        specifications: {
          Brand: apiProduct.storeName || "Shop-Easy",
          "Product Name": apiProduct.name,
          Category: apiProduct.category?.trim(),
          SKU: `SKU-${apiProduct.id}`,
          "In Stock": apiProduct.stockQuantity > 0 ? "Yes" : "No",
          "Stock Quantity": apiProduct.stockQuantity,
          Price: `$${apiProduct.finalPrice}`,
          ...(apiProduct.originalPrice && apiProduct.discount
            ? {
                "Original Price": `$${apiProduct.originalPrice}`,
                Discount: `${apiProduct.discount}%`,
              }
            : {}),
          Warranty: "1 Year Manufacturer Warranty",
        },

        // Mock shipping info
        shippingInfo: {
          freeShipping: true,
          estimatedDelivery: "3-5 business days",
          returnPolicy: "30-day return policy",
        },

        // Mock reviews
        reviews: [
          {
            id: 1,
            userName: "John Doe",
            userAvatar: "👨",
            rating: 5,
            date: "2024-01-15",
            title: "Excellent product!",
            comment:
              "Really happy with this purchase. Quality is great and it works exactly as described. Highly recommend!",
            verified: true,
            helpful: 45,
          },
          {
            id: 2,
            userName: "Sarah Smith",
            userAvatar: "👩",
            rating: 4,
            date: "2024-01-10",
            title: "Good value for money",
            comment:
              "Good product overall. Does what it's supposed to do. Only minor issue was delivery took a bit longer than expected.",
            verified: true,
            helpful: 32,
          },
          {
            id: 3,
            userName: "Mike Johnson",
            userAvatar: "👨‍💼",
            rating: 5,
            date: "2024-01-05",
            title: "Best purchase this year",
            comment:
              "Absolutely love it! Exceeded my expectations. Will definitely buy from this store again.",
            verified: true,
            helpful: 28,
          },
        ],

        // Mock rating distribution
        ratingDistribution: {
          5: 850,
          4: 280,
          3: 70,
          2: 20,
          1: 14,
        },
      }
    : null;

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.colors?.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      if (product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [apiProduct]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    const productForCart = {
      id: product.id,
      productName: product.name,
      colors: selectedColor,
      sizes: selectedSize,
      quantity,
      storeName: product.storeName,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrls[0],
      storeId: product.storeId,
      originalPrice: product.originalPrice,
      finalPrice: product.finalPrice,
      storeLogo: product.storeLogoUrl,
      vendorId: product.vendorId,
    };
    addToCart(productForCart);
    // TODO: Implement actual cart functionality
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const incrementQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateRatingPercentage = (star) => {
    if (!product) return 0;
    const total = Object.values(product.ratingDistribution).reduce(
      (a, b) => a + b,
      0,
    );
    return Math.round((product.ratingDistribution[star] / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="text-6xl mb-4">😔</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          {error ? "Error loading product" : "This product doesn't exist"}
        </p>
        <Link
          to="/products"
          className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            <span>›</span>
            <Link to="/products" className="hover:text-primary-600">
              Products
            </Link>
            <span>›</span>
            <Link
              to={`/products?category=${product.category?.trim().toLowerCase()}`}
              className="hover:text-primary-600"
            >
              {product.category?.trim()}
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 relative group">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-[500px] object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      -{product.discount}% OFF
                    </div>
                  )}
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      {product.tag}
                    </div>
                  )}

                  {/* Image Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage(
                            (selectedImage - 1 + product.images.length) %
                              product.images.length,
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage(
                            (selectedImage + 1) % product.images.length,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-primary-500 scale-95"
                        : "border-gray-200 hover:border-primary-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            {/* Store Info */}
            <Link
              to={`/stores/${product.storeId}`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 group"
            >
              <span className="text-xl">🏪</span>
              <span className="font-semibold group-hover:underline">
                {product.storeName}
              </span>
              {/* <span className="text-sm text-gray-500">
                ⭐ {product.storeRating}
              </span> */}
            </Link>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {/* <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= Math.round(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="font-bold text-gray-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <button className="text-primary-600 hover:underline font-medium">
                {product.totalReviews} Reviews
              </button>
              
            </div> */}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {product.shippingInfo.freeShipping && (
                  <span className="text-green-600 font-semibold">
                    ✓ Free Shipping
                  </span>
                )}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-xl">✓</span>
                  <span className="font-semibold">
                    In Stock ({product.stockCount} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-xl">✗</span>
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Color Selection - Only show if colors exist */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Color:{" "}
                  <span className="text-primary-600">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color.name
                          ? "border-primary-500 scale-110 shadow-lg"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{
                        backgroundColor: color.hex,
                        // Add border for white color visibility
                        boxShadow:
                          color.hex.toUpperCase() === "#FFFFFF"
                            ? "inset 0 0 0 1px #e5e7eb"
                            : "none",
                      }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-xl font-bold"
                          style={{
                            color:
                              color.hex.toUpperCase() === "#FFFFFF" ||
                              color.hex.toUpperCase() === "#D4C5B9"
                                ? "#000"
                                : "#fff",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - Only show if sizes exist */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Size: <span className="text-primary-600">{selectedSize}</span>
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
                        selectedSize === size
                          ? "border-primary-500 bg-primary-50 text-primary-600"
                          : "border-gray-300 hover:border-primary-300 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 font-bold text-xl transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 font-bold text-xl transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.stockCount} pieces available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="text-2xl">🛒</span>
                Add to Cart
              </button>
              {/* <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Now
              </button> */}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-xl">🚚</span>
                <span>
                  Estimated Delivery:{" "}
                  <strong>{product.shippingInfo.estimatedDelivery}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-xl">↩️</span>
                <span>
                  <strong>{product.shippingInfo.returnPolicy}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-xl">🔒</span>
                <span>Secure Payment & Data Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 min-w-[150px] py-4 px-6 font-semibold transition-colors duration-300 ${
                activeTab === "description"
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 min-w-[150px] py-4 px-6 font-semibold transition-colors duration-300 ${
                activeTab === "specifications"
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Specifications
            </button>
            {/* <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 min-w-[150px] py-4 px-6 font-semibold transition-colors duration-300 ${
                activeTab === "reviews"
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Reviews ({product.totalReviews})
            </button> */}
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Product Description
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                  {product.expandedDescription}
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 text-xl mt-0.5">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex py-3 border-b">
                        <span className="font-semibold text-gray-900 w-1/2">
                          {key}:
                        </span>
                        <span className="text-gray-700 w-1/2">{value}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                {/* Rating Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 pb-8 border-b">
                  {/* Overall Rating */}
                  <div className="text-center lg:text-left">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {product.rating}
                    </div>
                    <div className="flex justify-center lg:justify-start mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${star <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">
                      {product.totalReviews} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="lg:col-span-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-medium text-gray-700 w-8">
                          {star} ⭐
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-yellow-400 h-full transition-all duration-500"
                            style={{
                              width: `${calculateRatingPercentage(star)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {calculateRatingPercentage(star)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                {/* <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                          {review.userAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">
                              {review.userName}
                            </span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {review.title}
                          </h4>
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="text-gray-600 hover:text-primary-600 transition-colors duration-300">
                              👍 Helpful ({review.helpful})
                            </button>
                            <button className="text-gray-600 hover:text-primary-600 transition-colors duration-300">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}

                {/* <div className="text-center mt-8">
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
                    Load More Reviews
                  </button>
                </div> */}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
      </div>
    </div>
  );
};

export default ProductDetails;
