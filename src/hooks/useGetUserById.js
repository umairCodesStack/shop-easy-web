import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/authApi";

export function useGetUserById(userId) {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    onError: (error) => {
      console.error("❌ Error fetching user data:", error);
    },
    onSuccess: (data) => {
      console.log("✅ User data fetched successfully:", data);
    },
  });
  return { user, error, isLoading };
}
