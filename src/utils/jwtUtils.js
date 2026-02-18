import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const decoded = JSON.parse(jsonPayload);
    console.log("🔍 Decoded JWT:", decoded);

    // Your JWT has userId in the payload
    return decoded.userId || decoded.sub || decoded.id;
  } catch (error) {
    console.error("❌ Error decoding JWT:", error);
    return null;
  }
};
export function getUserData() {
  const token = localStorage.getItem("authToken");
  const userData = jwtDecode(token);
  return userData;
}
