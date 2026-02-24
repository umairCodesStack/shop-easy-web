import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useGetAllStores } from "../hooks/useGetAllStores";
import { useGetUserById } from "../hooks/useGetUserById";
import Spinner from "../components/common/Spinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useUpdateStoreStatus } from "../hooks/useUpdateStoreStatus";
import { useDeleteStore } from "../hooks/useDeleteStore";
import AdminNavbar from "../components/common/AdminNavbar";

// Status options your backend supports
const statusOptions = ["Active", "Inactive", "Blocked"];

// Mock stores data
const MOCK_STORES = [
  {
    id: 1,
    name: "TechVault Store",
    ownerId: "34",
    description: "Premium electronics and gadgets",
    logoUrl: "https://via.placeholder.com/44",
    logo: "💻",
    status: "active",
    email: "techvault@example.com",
    phone: "+1-123-456-7890",
    address: "123 Tech Ave, Silicon Valley, CA",
  },
  {
    id: 2,
    name: "Fashion Gallery",
    ownerId: "21",
    description: "Trendy fashion for everyone",
    logoUrl: "",
    logo: "👗",
    status: "inactive",
    email: "fashiongallery@example.com",
    phone: "+1-987-654-3210",
    address: "456 Style Street, New York, NY",
  },
  {
    id: 3,
    name: "Sports Arena",
    ownerId: "49",
    description: "Quality sports equipment",
    logoUrl: "",
    logo: "⚽",
    status: "blocked",
    email: "sportsarena@example.com",
    phone: "+1-555-555-5555",
    address: "789 Champion Blvd, Austin, TX",
  },
];

const AdminPage = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const { data: storesData, isLoading, error } = useGetAllStores();
  const {
    mutate: updateStore,
    isLoading: updatingStore,
    error: updateError,
  } = useUpdateStoreStatus();
  const { mutate: deleteStore, isLoading: deletingStore } = useDeleteStore();
  if (isLoading) return <Spinner />;

  if (error) return <ErrorMessage message="Failed to load stores." />;

  const handleStatusUpdate = (storeId, newStatus) => {
    updateStore({ storeId, newStatus });
  };

  const handleDelete = (storeId) => {
    deleteStore(storeId);
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Admin: Manage Stores
          </h1>
          {storesData && storesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 text-sm">
                    <th className="py-3 px-4">Store</th>
                    <th className="py-3 px-4">Owner Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storesData?.map((store) => (
                    <tr key={store.id} className="border-b last:border-none">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {store.logoUrl ? (
                            <img
                              src={store.logoUrl}
                              alt={store.name}
                              className="w-10 h-10 rounded-full object-cover border"
                            />
                          ) : (
                            <span className="text-2xl">🏪</span>
                          )}
                          <span className="font-semibold text-gray-900">
                            {store.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{store.ownerName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {store.description}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={
                            store.isBlocked
                              ? "Blocked"
                              : store.isActive
                                ? "Active"
                                : "Inactive"
                          }
                          onChange={(e) =>
                            handleStatusUpdate(store.id, e.target.value)
                          }
                          className="px-3 py-1 rounded-lg border border-gray-300 bg-gray-50 font-semibold
                            focus:ring-primary-500 focus:border-primary-500 transition-all"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => setSelectedStore(store)}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all font-semibold"
                        >
                          Show Detail
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          disabled={deletingStore}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              No stores available.
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Store Detail Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 pt-16 max-w-xl w-full min-h-[550px] relative overflow-hidden">
            {" "}
            {/* Close Button */}
            <button
              onClick={() => setSelectedStore(null)}
              className="absolute top-4 right-4 rounded-full bg-gray-100 hover:bg-gray-200 transition p-2 flex items-center justify-center"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
            {/* Store Logo/Icon */}
            <div className="flex flex-col items-center justify-center mb-5 -mt-16">
              {selectedStore.logoUrl ? (
                <img
                  src={selectedStore.logoUrl}
                  alt={selectedStore.name}
                  className="w-20 h-20 rounded-full border-4 border-primary-200 object-cover bg-white shadow-md"
                />
              ) : (
                <span className="text-2xl">🏪</span>
              )}
            </div>
            {/* Store Name & Status */}
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedStore.name}
              </h3>
              <span
                className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold
    ${
      selectedStore.isBlocked === true
        ? "bg-red-100 text-red-600"
        : selectedStore.isActive === true
          ? "bg-green-100 text-green-700"
          : selectedStore.isActive === false
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-600"
    }`}
              >
                {selectedStore.isBlocked === true
                  ? "Blocked"
                  : selectedStore.isActive === true
                    ? "Active"
                    : selectedStore.isActive === false
                      ? "Inactive"
                      : "Unknown"}
              </span>
            </div>
            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 mb-5"></div>
            {/* Information Sections */}
            <div className="space-y-4">
              {/* Store Description */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14 2 14 8 20 8"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-gray-700 text-[15px]">
                  {selectedStore.description}
                </span>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.5 21a9 9 0 0 1 13 0"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="font-semibold text-gray-900">
                    Owner Name:
                  </span>{" "}
                  {selectedStore.ownerName}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="16"
                      x="2"
                      y="4"
                      rx="2"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 6l-10 7L2 6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  {selectedStore.ownerEmail}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22 16.92V17a2 2 0 0 1-2 2c-9.94 0-18-8.06-18-18a2 2 0 0 1 2-2h.09c.72 0 1.42.1 2.1.3a2 2 0 0 1 1.36 1.36c.2.68.3 1.38.3 2.1A2 2 0 0 1 5 7v0c0 .53.21 1.04.58 1.42l2.34 2.34a2 2 0 0 1 .59 1.42c0 .53-.21 1.04-.59 1.42s-.89.59-1.42.59-.97-.21-1.42-.59L3.58 12.4c-.39-.38-.62-.9-.62-1.42"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="font-semibold text-gray-900">Phone:</span>{" "}
                  {selectedStore.phoneNumber}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="font-semibold text-gray-900">Address:</span>{" "}
                  {selectedStore.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
