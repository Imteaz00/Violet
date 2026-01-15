"use server";
import { BACKEND_URL } from "@/server";
import { auth } from "@clerk/nextjs/server";

export default async function updateOrder(orderId: string) {
  try {
    if (!orderId?.trim()) {
      throw new Error("Order ID is required");
    }
    const { userId, getToken } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const token = await getToken();
    if (!token) {
      throw new Error("Failed to obtain authentication token");
    }
    const res = await fetch(`${BACKEND_URL}/connections/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to update order: " + res.statusText);
    }
    return await res.json();
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}
