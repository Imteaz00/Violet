"use server";

import { BACKEND_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/server";
import { CreateProductType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function createProduct(formData: CreateProductType, images: File[]) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return { error: "Authentication required" };
    }
    const uploadedImages = await uploadImage(images);
    const res = await fetch(`${BACKEND_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ ...formData, images: uploadedImages }),
    });
    if (!res.ok) {
      return { error: `Failed to create product: ${res.statusText}` };
    }

    return await res.json();
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}

async function uploadImage(images: File[]): Promise<{ public_id: string; url: string }[]> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration missing");
  }

  const imageUrls: { public_id: string; url: string }[] = [];

  // Upload images sequentially to avoid body size limit
  for (const image of images) {
    const form = new FormData();
    form.append("file", image, image.name);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: form,
      },
    );

    const data = await res.json();
    if (!res.ok || !data?.secure_url) {
      throw new Error(data?.error?.message || "Failed to upload image");
    }

    imageUrls.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imageUrls;
}
