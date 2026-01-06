"use client"

import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export default function ShoppingBagIcon() {
    return (
        <Button variant={"ghost"} className="hover:bg-accent hover:text-accent-foreground">
            <Link href="/bag" className="relative inline-flex">
                <ShoppingBag className="w-4 h-4" />

                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    0
                </span>
            </Link>
        </Button>

    )
}
