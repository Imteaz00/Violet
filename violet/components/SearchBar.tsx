"use client"
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [value, setValue] = useState(searchParams.get("search") ?? "")
    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("search", value)
        router.replace(`/products?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="hidden md:flex items-center gap-2 rounded-md ring-1 ring-border px-2 py-1 h-6">
            <Search className="w-4 h-4 text-foreground" />
            <input id="search"
                placeholder="Skin, Hair, ..."
                className="text-sm outline-0"
                autoComplete="off"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { handleSearch(value) } }}
            />
        </div>
    )
}
