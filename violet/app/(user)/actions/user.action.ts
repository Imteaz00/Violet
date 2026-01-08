"use server";

import { BACKEND_URL } from "@/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    const res = await fetch(`${BACKEND_URL}/api/users/sync`, {
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

export async function syncUserIfNeeded() {
  const user = await currentUser();
  if (!user) return;

  const cookieStore = await cookies();
  const lastSync = cookieStore.get("last_user_sync")?.value;
  const shouldSync = !lastSync || Date.now() - parseInt(lastSync) > 3600000;

  if (shouldSync) {
    await syncUser();
    cookieStore.set("last_user_sync", Date.now().toString());
  }
}
