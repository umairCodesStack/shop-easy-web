import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../utils/constants";
import { getAuthToken } from "./authApi";

export async function updateStoreStatus(storeId, newStatus) {
  const token = getAuthToken();
  const { role } = jwtDecode(token);
  console.log(newStatus);

  if (!token && role !== "Admin") {
    throw new Error("You are not Authorized to perform this action");
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/Store/updateStoreStatus?id=${storeId}&newStatus=${newStatus}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      let errorMsg = "Unknown error";
      throw new Error(errorMsg);
    }
  } catch (e) {
    console.log(e.message);
    throw e;
  }
}
export async function deleteStore(storeId) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You are not Authorized to perform this action");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Store/deleteStore?id=${storeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
}
