export default function VendorProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
