"use server";
import { BACKEND_URL } from "@/server";
import { OrderType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function fetchUserOrders(): Promise<OrderType[]> {
  try {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/connections/user-connections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to fetch user orders:", res.status, res.statusText);
      throw new Error(`Failed to fetch user orders: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}
