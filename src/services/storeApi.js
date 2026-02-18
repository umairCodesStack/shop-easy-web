import { API_BASE_URL } from "../utils/constants";
import {
  getItemWithExpiry,
  setItemWithExpiry,
  setItemWithServerExpiry,
} from "../utils/localStorageUtils";
import { getAuthToken } from "./authApi";
import { supabase, supabaseUrl } from "./supabase";

export async function createStore(storeData) {
  console.log("🔵 createStore function called");

  const token = getAuthToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    let logoUrl = null;
    let bannerUrl = null;
    let uploadedLogoPath = null;
    let uploadedBannerPath = null;

    // Upload Logo to Supabase if provided
    if (storeData.logo) {
      console.log("📸 Uploading logo to Supabase...");

      const logoName =
        `${Date.now()}-${Math.random()}-${storeData.logo.name}`.replaceAll(
          "/",
          "",
        );
      uploadedLogoPath = `logos/${logoName}`;

      const { data: logoData, error: logoError } = await supabase.storage
        .from("Store")
        .upload(uploadedLogoPath, storeData.logo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (logoError) {
        console.error("❌ Error uploading logo:", logoError);
        throw new Error("Failed to upload store logo");
      }

      // Get public URL for logo
      const { data: logoPublicData } = supabase.storage
        .from("Store")
        .getPublicUrl(uploadedLogoPath);

      logoUrl = logoPublicData.publicUrl;
      console.log("✅ Logo uploaded successfully:", logoUrl);
    }

    // Upload Banner to Supabase if provided
    if (storeData.banner) {
      console.log("🎨 Uploading banner to Supabase...");

      const bannerName =
        `${Date.now()}-${Math.random()}-${storeData.banner.name}`.replaceAll(
          "/",
          "",
        );
      uploadedBannerPath = `banners/${bannerName}`;

      const { data: bannerData, error: bannerError } = await supabase.storage
        .from("Store")
        .upload(uploadedBannerPath, storeData.banner, {
          cacheControl: "3600",
          upsert: false,
        });

      if (bannerError) {
        console.error("❌ Error uploading banner:", bannerError);

        // Rollback: delete logo if banner upload fails
        if (uploadedLogoPath) {
          console.log("🔄 Rolling back logo upload...");
          await supabase.storage.from("Store").remove([uploadedLogoPath]);
        }

        throw new Error("Failed to upload store banner");
      }

      // Get public URL for banner
      const { data: bannerPublicData } = supabase.storage
        .from("Store")
        .getPublicUrl(uploadedBannerPath);

      bannerUrl = bannerPublicData.publicUrl;
      console.log("✅ Banner uploaded successfully:", bannerUrl);
    }

    // Prepare final store data - only include image URLs if they were uploaded
    const finalStoreData = {
      name: storeData.name,
      description: storeData.description || "",
      ownerId: storeData.ownerId,
      phoneNumber: storeData.phoneNumber || "",
      address: storeData.address || "",
      isActive: storeData.isActive,
    };

    // Only add logoUrl if image was uploaded
    if (logoUrl) {
      finalStoreData.logoUrl = logoUrl;
    }

    // Only add bannerUrl if image was uploaded
    if (bannerUrl) {
      finalStoreData.bannerUrl = bannerUrl;
    }

    console.log("📦 Sending store data to API:", finalStoreData);

    // Send data to your backend API
    const response = await fetch(`${API_BASE_URL}/api/Store/addStore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalStoreData),
    });

    console.log("🔵 API Response status:", response.status);

    if (!response.ok) {
      // Rollback: delete uploaded images if API returns error
      if (uploadedLogoPath) {
        console.log("🔄 Rolling back logo upload...");
        await supabase.storage.from("Store").remove([uploadedLogoPath]);
      }
      if (uploadedBannerPath) {
        console.log("🔄 Rolling back banner upload...");
        await supabase.storage.from("Store").remove([uploadedBannerPath]);
      }

      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create store" }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ success: true }));

    return data;
  } catch (error) {
    console.error("❌ createStore error:", error);
    throw error;
  }
}
export async function getStoreByOwnerId(ownerId) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/Store/getStoreByOwnerId?ownerId=${ownerId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch store: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export async function updateStore(storeData) {
  console.log("🔵 updateStore function called");
  console.log("🆔 Store ID from storeData:", storeData.id);

  const token = getAuthToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log("🔑 Auth token retrieved successfully", token);
  if (!storeData.id) {
    console.error("❌ No store ID provided!");
    throw new Error("Store ID is required for update");
  }

  try {
    let logoUrl = storeData.logoUrl; // Keep existing URL
    let bannerUrl = storeData.bannerUrl; // Keep existing URL
    let uploadedLogoPath = null;
    let uploadedBannerPath = null;

    // Upload new logo if provided
    if (storeData.logo) {
      console.log("📸 Uploading new logo...");

      const logoName =
        `${Date.now()}-${Math.random()}-${storeData.logo.name}`.replaceAll(
          "/",
          "",
        );
      uploadedLogoPath = `logos/${logoName}`;

      const { error: logoError } = await supabase.storage
        .from("Store")
        .upload(uploadedLogoPath, storeData.logo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (logoError) {
        console.error("❌ Error uploading logo:", logoError);
        throw new Error("Failed to upload store logo");
      }

      const { data: logoPublicData } = supabase.storage
        .from("Store")
        .getPublicUrl(uploadedLogoPath);

      logoUrl = logoPublicData.publicUrl;
      console.log("✅ Logo uploaded:", logoUrl);
    }

    // Upload new banner if provided
    if (storeData.banner) {
      console.log("🎨 Uploading new banner...");

      const bannerName =
        `${Date.now()}-${Math.random()}-${storeData.banner.name}`.replaceAll(
          "/",
          "",
        );
      uploadedBannerPath = `banners/${bannerName}`;

      const { error: bannerError } = await supabase.storage
        .from("Store")
        .upload(uploadedBannerPath, storeData.banner, {
          cacheControl: "3600",
          upsert: false,
        });

      if (bannerError) {
        console.error("❌ Error uploading banner:", bannerError);

        if (uploadedLogoPath) {
          await supabase.storage.from("Store").remove([uploadedLogoPath]);
        }

        throw new Error("Failed to upload store banner");
      }

      const { data: bannerPublicData } = supabase.storage
        .from("Store")
        .getPublicUrl(uploadedBannerPath);

      bannerUrl = bannerPublicData.publicUrl;
      console.log("✅ Banner uploaded:", bannerUrl);
    }

    // Prepare update data according to Swagger schema
    const finalStoreData = {
      id: storeData.id || 0, // Required - Store ID
      name: storeData.name || "",
      description: storeData.description || "",
      logoUrl: logoUrl || "",
      bannerUrl: bannerUrl || "",
      phoneNumber: storeData.phoneNumber || "",
      address: storeData.address || "",
      isActive: storeData.isActive ?? true,
      approvalStatus: storeData.approvalStatus || "Pending", // Add approval status
    };

    console.log("📦 Final data being sent to API:", finalStoreData);

    const response = await fetch(`${API_BASE_URL}/api/Store/updateStore`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalStoreData),
    });

    console.log("🔵 Response status:", response.status);

    if (!response.ok) {
      // Rollback uploaded images
      if (uploadedLogoPath) {
        console.log("🔄 Rolling back logo upload...");
        await supabase.storage.from("Store").remove([uploadedLogoPath]);
      }
      if (uploadedBannerPath) {
        console.log("🔄 Rolling back banner upload...");
        await supabase.storage.from("Store").remove([uploadedBannerPath]);
      }

      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update store" }));

      console.error("❌ API Error:", errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log("✅ Store updated successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ updateStore error:", error);
    throw error;
  }
}
