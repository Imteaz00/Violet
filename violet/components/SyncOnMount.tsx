// components/SyncOnMount.tsx
"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUserIfNeeded } from "@/app/(user)/actions/user.action";

export default function SyncOnMount() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;
    // call server action (runs server-side, can mutate cookies)
    syncUserIfNeeded().catch(console.error);
  }, [isSignedIn]);

  return null;
}
