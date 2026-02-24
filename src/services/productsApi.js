import { API_BASE_URL } from "../utils/constants";
import { deleteImagesFromSupabase } from "../utils/deleteImagesFromSupabase";
import { getUserData } from "../utils/jwtUtils";
import { getAuthToken } from "./authApi";
import { supabase, supabaseUrl } from "./supabase";
export default async function getProducts() {
  let url = `${API_BASE_URL}/odata/Product`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getTrendingProducts() {
  const url = `${API_BASE_URL}/odata/Product?$filter=Rating gt 4.5&$orderby=Rating desc&$top=10`;

  try {
    console.log("Fetching trending products:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.value || data;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }
}
export async function getHotDealsProduct() {
  const url = `${API_BASE_URL}/odata/Product?$filter=tolower(Tag) eq 'hot deal'`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.value || data;
  } catch (error) {
    console.error("Error fetching hot deals products:", error);
    throw error;
  }
}
export async function getCategories() {
  const url = `${API_BASE_URL}/odata/Product/getCatagories`;

  try {
    console.log("Fetching categories:", url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.value || data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
export async function getProductById(id) {
  const url = `${API_BASE_URL}/odata/Product/getProductById?product_id=${id}`;
  try {
    console.log("Fetching product by ID:", url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}
export async function getProductsByUserId(userId) {
  try {
    // Option 1: userId as integer
    const url = `${API_BASE_URL}/odata/Product/getProductByUserId?userId=${userId}`;

    console.log("🔵 Fetching products by user ID:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return data.value || data;
  } catch (error) {
    console.error("❌ Error fetching products by user ID:", error);
    throw error;
  }
}
export async function deleteProduct(productId, imageUrls) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log(imageUrls);
  if (imageUrls) {
    const { success, filePaths, deleted } =
      await deleteImagesFromSupabase(imageUrls);
    console.log(success, filePaths, "Deleted Images Number", deleted);
  }

  const url = `${API_BASE_URL}/odata/Product/DeleteProduct?product_id=${productId}`;

  try {
    console.log("🔵 Deleting product with ID:", productId);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    console.log("✅ Product deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    throw error;
  }
}
export async function createProduct(productData) {
  console.log("🔵 createProduct function called");

  const token = getAuthToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  if (!productData.storeId) {
    throw new Error("Store ID is required to create a product");
  }
  if (!productData.userId) {
    throw new Error("User ID is required to create a product");
  }
  try {
    const imageUrls = [];
    const uploadedImagePaths = [];

    // Upload all product images to Supabase if provided
    if (productData.images && productData.images.length > 0) {
      console.log(
        `📸 Uploading ${productData.images.length} images to Supabase...`,
      );

      for (let i = 0; i < productData.images.length; i++) {
        const image = productData.images[i];

        console.log(
          `📤 Uploading image ${i + 1}/${productData.images.length}...`,
        );

        const imageName =
          `${Date.now()}-${Math.random()}-${image.name}`.replaceAll("/", "");
        const uploadPath = `/${imageName}`;

        const { data: imageData, error: imageError } = await supabase.storage
          .from("Products")
          .upload(uploadPath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imageError) {
          console.error(`❌ Error uploading image ${i + 1}:`, imageError);

          // Rollback: delete all previously uploaded images
          if (uploadedImagePaths.length > 0) {
            console.log("🔄 Rolling back uploaded images...");
            await supabase.storage.from("Products").remove(uploadedImagePaths);
          }

          throw new Error(`Failed to upload product image ${i + 1}`);
        }

        // Get public URL for image
        const { data: imagePublicData } = supabase.storage
          .from("Products")
          .getPublicUrl(uploadPath);

        imageUrls.push(imagePublicData.publicUrl);
        uploadedImagePaths.push(uploadPath);

        console.log(
          `✅ Image ${i + 1} uploaded successfully:`,
          imagePublicData.publicUrl,
        );
      }

      console.log(`✅ All ${imageUrls.length} images uploaded successfully`);
    }

    // Prepare final product data matching the API payload
    const finalProductData = {
      name: productData.name,
      description: productData.description || "",
      price: parseFloat(productData.price),
      stockQuantity: parseInt(productData.stockQuantity),
      storeId: productData.storeId,
      category: productData.category,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      imageUrls: imageUrls,
      userId: productData.userId,
      discount: parseFloat(productData.discount) || 0,
      tag: productData.tag || "",
    };

    console.log("📦 Sending product data to API:", finalProductData);

    // Send data to your backend API
    const response = await fetch(`${API_BASE_URL}/odata/Product/AddProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalProductData),
    });

    console.log("🔵 API Response status:", response.status);

    if (!response.ok) {
      // Rollback: delete uploaded images if API returns error
      if (uploadedImagePaths.length > 0) {
        console.log("🔄 Rolling back all uploaded images...");
        await supabase.storage.from("Products").remove(uploadedImagePaths);
      }

      const errorText = await response.text();
      console.error("❌ Error response:", errorText);

      const errorData = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));

      throw new Error(
        errorData.message ||
          `HTTP error! status: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("✅ Product created successfully:", data);

    return data;
  } catch (error) {
    console.error("❌ createProduct error:", error);
    throw error;
  }
}
export async function updateProduct(productId, updateData) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Unauthorized");
    }
    // 1. Handle image deletions from Supabase Storage
    if (updateData.imagesToRemove?.length > 0) {
      console.log("🗑️ Deleting images from Supabase...");
      await deleteImagesFromSupabase(updateData.imagesToRemove);
    }

    // 2. Handle new image uploads to Supabase Storage
    let uploadedImageUrls = [];
    if (updateData.newImages?.length > 0) {
      console.log(`📤 Uploading ${updateData.newImages.length} new images...`);

      for (let i = 0; i < updateData.newImages.length; i++) {
        const image = updateData.newImages[i];

        const imageName =
          `${Date.now()}-${Math.random()}-${image.name}`.replaceAll("/", "");

        const { data: imageData, error: imageError } = await supabase.storage
          .from("Products")
          .upload(imageName, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imageError) {
          console.error(`❌ Error uploading image ${i + 1}:`, imageError);

          // Rollback
          if (uploadedImageUrls.length > 0) {
            console.log("🔄 Rolling back uploaded images...");
            const pathsToDelete = uploadedImageUrls.map((url) => {
              const u = new URL(url);
              const marker = "/storage/v1/object/public/Products/";
              const idx = u.pathname.indexOf(marker);
              return decodeURIComponent(u.pathname.slice(idx + marker.length));
            });
            await supabase.storage.from("Products").remove(pathsToDelete);
          }

          throw new Error(
            `Failed to upload image ${i + 1}: ${imageError.message}`,
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("Products")
          .getPublicUrl(imageName);

        uploadedImageUrls.push(publicUrlData.publicUrl);
        console.log(
          `✅ Uploaded image ${i + 1}/${updateData.newImages.length}`,
        );
      }
    }

    // 3. Prepare DTO matching C# backend
    const productDTO = {
      name: updateData.name || null,
      description: updateData.description || null,
      price: updateData.price ? parseFloat(updateData.price) : null,
      stockQuantity: updateData.stock ? parseInt(updateData.stock) : null,
      category: updateData.category || null,
      discount: updateData.discount ? parseFloat(updateData.discount) : null,
      tag: updateData.tags || null,

      // Images
      imageUrlsToRemove: updateData.imagesToRemove || null,
      newImageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,

      // Sizes
      sizesToRemove:
        updateData.sizesToRemove?.length > 0 ? updateData.sizesToRemove : null,
      newSizes: updateData.newSizes?.length > 0 ? updateData.newSizes : null,

      // Colors
      colorsToRemove:
        updateData.colorsToRemove?.length > 0
          ? updateData.colorsToRemove
          : null,
      newColors: updateData.newColors?.length > 0 ? updateData.newColors : null,
    };

    console.log("📦 Sending update to API:", productDTO);

    // 4. Call backend API
    const response = await fetch(`${API_BASE_URL}/odata/Product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productDTO),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update product";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.title || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.text();
    console.log("✅ Product updated successfully:", result);

    return {
      success: true,
      message: result,
    };
  } catch (error) {
    console.error("❌ Error updating product:", error);
    throw error;
  }
}
