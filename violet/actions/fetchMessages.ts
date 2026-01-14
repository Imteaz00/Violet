import { BACKEND_URL } from "@/server";
import { auth } from "@clerk/nextjs/server";

export default async function fetchMessages() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to fetch messages:", res.status, res.statusText);
      throw new Error(`Failed to fetch messages: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
