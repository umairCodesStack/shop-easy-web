import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // or your toast library
import { signup as signupApi } from "../services/authApi";
export function useSignupUser() {
  const navigate = useNavigate();

  const {
    mutate: signup,
    error,
    isLoading,
    data, // Add this to access the response data
  } = useMutation({
    mutationKey: ["signupUser"], // Fixed: should be mutationKey not queryKey
    mutationFn: (userData) => signupApi(userData),
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data);

      console.log("Token:", data.accessToken);

      // Optionally store token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      toast.success("Signup successful! Please log in.");
      navigate("/");
    },
  });

  return {
    signup,
    error,
    isLoading,
    data, // Return data so components can access it
  };
}
