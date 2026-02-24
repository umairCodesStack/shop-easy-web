import React from "react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import StoreCard from "../components/vendor/StoreCard";

import { useGetAllStores } from "../hooks/useGetAllStores";

// Skeleton for loading (optional, add if you have/need one)
function StoreCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-md animate-pulse min-h-[220px]" />
  );
}

const StoresPage = () => {
  // Fetch all stores/vendors
  const { data: storesData, isLoading, error } = useGetAllStores();
  const stores = storesData?.filter((store) => store.isActive === true);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              All Stores
            </h1>
            <p className="text-gray-600">
              Browse all vendors and find your favorite store.
            </p>
          </div>

          {/* Stores grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, idx) => (
                <StoreCardSkeleton key={idx} />
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500 py-12">
                <p className="text-lg font-semibold mb-2">
                  Failed to load stores.
                </p>
                <p className="text-sm">{error.message}</p>
              </div>
            ) : stores && stores.length > 0 ? (
              stores.map((store) => <StoreCard key={store.id} vendor={store} />)
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                <p className="text-lg">No stores available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StoresPage;
