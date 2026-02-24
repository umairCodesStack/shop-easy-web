import React from "react";
import { Link } from "react-router-dom";
import { useGetStoreProducts } from "../../hooks/useGetStoreProducts";
import { useGetVendorOrder } from "../../hooks/useGetVendorOrder";
import { useGetCustomers } from "../../hooks/useGetCustomers";

function StoreCard({ vendor }) {
  // Use vendor.ownerId and vendor.id dynamically:
  const {
    products,
    isLoading: isStoreProductsLoading,
    error: errorProducts,
  } = useGetStoreProducts(vendor.ownerId);

  const {
    data: vendorOrders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetVendorOrder(vendor.ownerId);

  const {
    data: customers,
    isLoading: loadingCustomers,
    error: customerError,
  } = useGetCustomers(vendor.ownerId);
  // Compute stats safely, fallback to 0 if loading/error
  const totalProducts =
    !isStoreProductsLoading && !errorProducts && Array.isArray(products)
      ? products.length
      : 0;

  const totalOrders =
    !loadingOrders && !errorOrders && Array.isArray(vendorOrders)
      ? vendorOrders.length
      : 0;

  const totalCustomers =
    !loadingCustomers && !customerError && Array.isArray(customers)
      ? customers.length
      : 0;

  return (
    <Link
      to={`/store/${vendor.ownerId}`}
      className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-500"
    >
      {/* Vendor Logo & Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          {vendor.logoUrl ? (
            <img src={vendor.logoUrl} className="w-full h-full object-cover" />
          ) : (
            <span>{"🏪"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
            {vendor.name}
          </h3>
          <p className="text-sm text-gray-600 truncate">{vendor.description}</p>
        </div>
      </div>

      {/* Vendor Stats */}
      <div className="flex justify-around items-center bg-white rounded-xl p-4 shadow-sm">
        {/* Items */}
        <div className="text-center">
          <div className="font-bold text-gray-900 mb-1">
            {isStoreProductsLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              totalProducts
            )}
          </div>
          <div className="text-xs text-gray-500">Items</div>
        </div>
        <div className="w-px h-10 bg-gray-200"></div>

        {/* Sales */}
        <div className="text-center">
          <div className="font-bold text-gray-900 mb-1">
            {loadingOrders ? (
              <span className="animate-pulse">...</span>
            ) : (
              totalOrders
            )}
          </div>
          <div className="text-xs text-gray-500">Sales</div>
        </div>
        <div className="w-px h-10 bg-gray-200"></div>

        {/* Customers (unique or total) */}
        <div className="text-center">
          <div className="font-bold text-gray-900 mb-1">
            {loadingCustomers ? (
              <span className="animate-pulse">...</span>
            ) : (
              totalCustomers
            )}
          </div>
          <div className="text-xs text-gray-500">Customers</div>
        </div>
      </div>
    </Link>
  );
}

export default StoreCard;
