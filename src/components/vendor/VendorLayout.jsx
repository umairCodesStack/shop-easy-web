import { useState } from "react";
import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSideBar";
import VendorNavbar from "./VendorNavbar";
import { getUserData } from "../../utils/jwtUtils";
import useGetStore from "../../hooks/useGetStore";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";

function VendorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const userData = getUserData();
  const { storeData, error, isLoading } = useGetStore(userData.userId);
  // if (!storeData.isActive)
  //   return (
  //     <ErrorMessage message="Your Store is yet not approved from Admin of Shop-Easy" />
  //   );
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  if (!isLoading && storeData.isActive === false)
    return (
      <ErrorMessage message="Your Store is yet not approved from Admin of Shop-Easy" />
    );
  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar
        toggleSidebar={toggleSidebar}
        userData={userData}
        storeData={storeData}
      />

      <div className="flex relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-50 lg:z-auto transform transition-transform duration-300 ease-in-out lg:transform-none ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <VendorSidebar closeSidebar={closeSidebar} />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
