"use server";

import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "@/server";

export async function fetchMyOrderCount() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const token = await getToken();
    if (!token) throw new Error("Failed to obtain token");
    const res = await fetch(`${BACKEND_URL}/connections/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to fetch orders count:", res.status, res.statusText);
      throw new Error(`Failed to fetch orders count: ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Orders count data:", data);
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching orders count:", error);
    return 0;
  }
}
