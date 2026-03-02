import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dfu1jzscc",
  api_key: "574883235143228",
  api_secret: "Nhc0GbdCAlwX3y6z0hUPjkIf0yc",
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "No image URL provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract public ID from URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      return new Response(
        JSON.stringify({ error: "Invalid image URL" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete image" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary image URL
 * @returns The public ID or null if not found
 */
function extractPublicIdFromUrl(url: string): string | null {
  // Example URL: https://res.cloudinary.com/dfu1jzscc/image/upload/v1702345678/folder/name.jpg
  const match = url.match(/\/([^\/]+\/[^\/]+)\.[^\/]+$/);
  return match ? match[1] : null;
}