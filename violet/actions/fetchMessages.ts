import { BACKEND_URL } from "@/server";
import { MessageType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function fetchMessages(): Promise<MessageType[]> {
  try {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const token = await getToken();
    if (!token) throw new Error("Failed to get authentication token");
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
