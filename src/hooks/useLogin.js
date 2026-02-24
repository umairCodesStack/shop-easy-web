import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // or your toast library
import { login as loginApi } from "../services/authApi";
export function useLogin() {
  const navigate = useNavigate();
  const {
    mutate: login,
    error,
    isLoading,
  } = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: (credentials) => loginApi(credentials),
    onSuccess: (data) => {
      toast.success("Login successful!");

      if (data.role === "Vendor") {
        navigate("/vendor/dashboard");
      } else if (data.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
  return { login, error, isLoading };
}
