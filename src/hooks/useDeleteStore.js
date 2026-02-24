import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStore } from "../services/adminApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useDeleteStore() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["deleteStore"],
    mutationFn: (storeId) => deleteStore(storeId),
    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete Store Status");
    },
    onSuccess: () => {
      toast.success("Store Deleted Successfully");
      navigate("/login");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
  return { mutate, isLoading, error };
}
