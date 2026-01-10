import { BACKEND_URL } from "@/server";
import { CreateProductType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createProduct(formData: CreateProductType) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(`${BACKEND_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create product");
    }
    redirect("/home");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
