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
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "telegram-userbot/auto-replies",
      resource_type: "image",
      transformation: [
        { width: 800, height: 600, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    return new Response(
      JSON.stringify({ url: result.secure_url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload image" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}