import { API_BASE_URL } from "../utils/constants";

export async function signup(userData) {
  const response = await fetch(`${API_BASE_URL}/api/UserAuth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  console.log("Signup response status:", response.status);

  // Parse the response
  const data = await response.json();

  // Check if the response is not OK (status code 400-599)
  if (!response.ok) {
    // Throw error so React Query catches it in onError
    throw new Error(data.message || "Signup failed");
  }

  // Return the parsed data
  return data;
}
