"use server";

import { BACKEND_URL } from "@/server";
import { UserType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function fetchUserData(): Promise<UserType | null> {
  try {
    const { userId, getToken } = await auth();
    if (userId) {
      const token = await getToken();
      if (!token) {
        console.error("Failed to get authentication token");
        return null;
      }
      const res = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch user data:", res.status, res.statusText);
        return null;
      }
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
  return null;
}
