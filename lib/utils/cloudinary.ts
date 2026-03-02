/**
 * Upload an image to Cloudinary via API route
 * @param file - The image file to upload
 * @returns Promise resolving to the secure URL of the uploaded image
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Delete an image from Cloudinary via API route
 * @param imageUrl - The URL of the image to delete
 * @returns Promise resolving to the deletion result
 */
export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
  try {
    const response = await fetch("/api/delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    await response.json();
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}