"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import useBagStore from "@/stores/bagStore";

export default function ShoppingBagIcon() {
  const { bag, hasHydrated } = useBagStore();

  if (!hasHydrated) return null;
  return (
    <Button
      variant={"ghost"}
      className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
      asChild
    >
      <Link href="/bag" className="relative inline-flex">
        <ShoppingBag className="w-4 h-4" />
        {bag.length > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {bag.reduce((acc, item) => acc + item.shares, 0)}
          </span>
        )}
      </Link>
    </Button>
  );
}
