"use server";

import { BACKEND_URL } from "@/server";
import { UserType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function sendMessage({
  receiver,
  text,
}: {
  receiver: UserType;
  text: string;
}) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: receiver.id,
        text,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      console.error("Response not ok:", res.status, res.statusText);
      throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
