"use server";

import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "@/server";

export async function fetchMyProductCount() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const token = await getToken();
    if (!token) throw new Error("Failed to obtain token");
    const res = await fetch(`${BACKEND_URL}/products/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to fetch products count:", res.status, res.statusText);
      throw new Error(`Failed to fetch products count: ${res.statusText}`);
    }
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching products count:", error);
    return 0;
  }
}
