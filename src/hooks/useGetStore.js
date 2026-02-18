import { useQuery } from "@tanstack/react-query";
import { getStoreByOwnerId } from "../services/storeApi";

export default function useGetStore(userId) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["storeData", userId],
    queryFn: () => getStoreByOwnerId(userId),
    onError: (error) => {
      console.error("Error fetching store data:", error);
    },
  });

  return { storeData: data, error, isLoading };
}
