"use server";

import { BACKEND_URL } from "@/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export async function syncUser() {
  try {
    const { userId, getToken } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: userId,
        name: user.fullName || user.firstName || "Unknown",
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      }),
      credentials: "include",
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

export async function syncUserIfNeeded({ force = false } = {}) {
  const user = await currentUser();
  if (!user) return { synced: false, reason: "no_user" };

  const cookieStore = await cookies();
  const lastSyncRaw = cookieStore.get("last_user_sync")?.value;
  const lastSyncTs = lastSyncRaw ? Number(lastSyncRaw) : 0;
  const shouldSync = force || !lastSyncTs || Date.now() - lastSyncTs > 30 * 60 * 1000; // 30 minutes

  if (!shouldSync) return { synced: false, reason: "recent" };

  await syncUser();

  try {
    cookieStore.set({
      name: "last_user_sync",
      value: Date.now().toString(),
      path: "/",
      httpOnly: true, // server-only cookie
    });
  } catch (err) {
    console.warn("Could not set last_user_sync cookie:", err);
  }

  return { synced: true };
}

export async function getUserId() {
  const { userId } = await auth();
  return userId;
}
