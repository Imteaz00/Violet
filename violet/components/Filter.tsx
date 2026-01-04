"use client"

import { CONSTANT } from "@/constants"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function Filter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathName = usePathname()
    const handleFilter = (value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set(CONSTANT.CATEGORY, value)
        router.push(`${pathName}?${params.toString()}`, { scroll: false })
    }
    return (
        <div className="flex items-center justify-end text-sm my-6 gap-2">

            <label htmlFor="sort" className="text-muted-foreground">Sort By</label>
            <select name="sort"
                id="sort"
                className="ring-2 ring-secondary p-1 rounded-sm bg-background"
                onChange={e => handleFilter(e.target.value)}
                aria-label="Sort products"
            >
                <option value="newest">Newest</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
            </select>
        </div >
    )
}
