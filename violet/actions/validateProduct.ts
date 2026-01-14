"use server";
import { BACKEND_URL } from "@/server";
import { auth } from "@clerk/nextjs/server";

export default async function validateProduct(productId: string) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/products/${productId}/validate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to validate product: " + res.statusText);
    }
    return await res.json();
  } catch (error) {
    console.error("Error validating product:", error);
    throw error;
  }
}
