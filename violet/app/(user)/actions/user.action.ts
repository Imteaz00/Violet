"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    const res = await fetch(`${process.env.BACKEND_URL}/api/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        name: user.fullName || user.firstName || "Unknown",
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to sync user: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
}
