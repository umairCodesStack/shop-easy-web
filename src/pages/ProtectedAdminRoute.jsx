import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    // Check token periodically (every 5 seconds)
    const checkToken = () => {
      const currentToken = localStorage.getItem("authToken");
      if (!currentToken) {
        navigate("/login", { replace: true });
      }
    };

    const intervalId = setInterval(checkToken, 5000);

    // Listen for storage changes (token deletion in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "authToken" && !e.newValue) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  // Initial check - redirect immediately if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
