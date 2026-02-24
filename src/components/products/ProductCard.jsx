import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Utility function to truncate description
function getShortDescription(description, maxLength = 80) {
  if (!description) return "";
  return description.length > maxLength
    ? description.substring(0, maxLength) + "..."
    : description;
}

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-2"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={product.imageUrl || product.imageUrls[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {product?.tag}
          </div>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Store Name */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <span>🏪</span>
          <span className="truncate">{product.storeName || "Store"}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Product Description (Truncated) */}
        {product.description && (
          <p className="mb-2 text-sm text-gray-500">
            {getShortDescription(product.description, 80)}
          </p>
        )}

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-primary-600">
              ${Math.round(product.finalPrice * 10) / 10}
            </span>
          </div>

          {/* <button
            onClick={handleAddToCart}
            className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            title="Add to Cart"
          >
            🛒
          </button> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
