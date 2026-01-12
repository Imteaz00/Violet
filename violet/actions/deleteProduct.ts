"use server";

import { BACKEND_URL } from "@/server";
import { auth } from "@clerk/nextjs/server";

export default async function deleteProduct(productId: string) {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error("Authentication required");
  }
  const token = await getToken();
  const res = await fetch(`${BACKEND_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete product: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}
