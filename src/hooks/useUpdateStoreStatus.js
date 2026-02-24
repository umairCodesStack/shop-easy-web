import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStoreStatus } from "../services/adminApi";
import toast from "react-hot-toast";

export function useUpdateStoreStatus() {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["updateStore"],
    mutationFn: ({ storeId, newStatus }) =>
      updateStoreStatus(storeId, newStatus),
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update Store Status");
    },
    onSuccess: () => {
      toast.success("Store Status Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
  return { mutate, isLoading, error };
}
