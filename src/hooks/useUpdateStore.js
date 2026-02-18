import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStore as updateStoreApi } from "../services/storeApi";

export function useUpdateStore() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (storeData) => updateStoreApi(storeData),
    onSuccess: () => {
      queryClient.invalidateQueries(["storeData"]);
    },
  });

  return {
    updateStore: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
