import { API_BASE_URL } from "../utils/constants";
import {
  getItemWithExpiry,
  setItemWithExpiry,
  setItemWithServerExpiry,
} from "../utils/localStorageUtils";

export async function signup(userData) {
  const response = await fetch(`${API_BASE_URL}/api/UserAuth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // Parse the response
  const data = await response.json();
  // Store token with server-provided expiry
  if (data.accessToken && data.expiresAt) {
    console.log("Token expires at:", data.expiresAt);
    setItemWithServerExpiry("authToken", data.accessToken, data.expiresAt);
    localStorage.setItem("tokenExpiresAt", data.expiresAt);
  }
  // Check if the response is not OK (status code 400-599)
  if (!response.ok) {
    // Throw error so React Query catches it in onError
    throw new Error(data.message || "Signup failed");
  }

  // Return the parsed data
  return data;
}
export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/UserAuth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    if (credentials.rememberMe && data.accessToken) {
      const expiryTime = new Date(data.expiresAt).getTime();
      const now = new Date().getTime();
      const minutesUntilExpiry = Math.floor((expiryTime - now) / 1000 / 60);
      console.log(`Token valid for ${minutesUntilExpiry} minutes`);

      setItemWithExpiry("authToken", data.accessToken, minutesUntilExpiry);

      localStorage.setItem("tokenExpiresAt", data.expiresAt);
    } else {
      setItemWithExpiry("authToken", data.accessToken, 5);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw the error to be caught by React Query
  }
}
export async function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiresAt");
}
export async function deleteAccount(userId) {
  const response = await fetch(
    `${API_BASE_URL}/api/UserAuth/deleteUser?userId=${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete account");
  }
  return true;
}
export function getAuthToken() {
  return getItemWithExpiry("authToken");
}
export async function updateUser(userData) {
  // ✅ Add async
  try {
    console.log("🔵 Updating user with data:", userData);

    if (!userData.id) {
      throw new Error("User ID is required for update");
    }

    const response = await fetch(`${API_BASE_URL}/api/UserAuth/updateUser`, {
      // ✅ Add await
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("🔵 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update user" }));

      console.error("❌ API Error:", errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json(); // ✅ Add await
    console.log("✅ User updated successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
}
export async function updatePassword(passwordData) {
  // ✅ Add async
  try {
    console.log("🔵 Updating password with data:", passwordData);

    const response = await fetch(
      `${API_BASE_URL}/api/UserAuth/updateUserPassword`,
      {
        // ✅ Add await
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      },
    );

    console.log("🔵 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update password" }));

      console.error("❌ API Error:", errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json(); // ✅ Add await
    console.log("✅ Password updated successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating password:", error);
    throw error;
  }
}
export async function getUserByEmail(email) {
  const response = await fetch(
    `${API_BASE_URL}/api/UserAuth/getUserByEmail?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export async function getUserById(userId) {
  const response = await fetch(
    `${API_BASE_URL}/api/UserAuth/getUserById?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
