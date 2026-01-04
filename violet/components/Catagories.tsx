"use client"
import { ShoppingBasket } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { CONSTANT } from "@/constants";

const categories = [
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "alli",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },
    {
        name: "All",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
    },

];

export default function Catagories() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathName = usePathname()
    const selectedCategory = searchParams.get(CONSTANT.CATEGORY)
    const handleChange = (value: string | null) => {
        const params = new URLSearchParams(searchParams)
        params.set(CONSTANT.CATEGORY, value || "all")
        router.push(`${pathName}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-2 rounded-lg text-sm bg-muted mb-4">
            {categories.map((category) => (category.slug === selectedCategory ?
                <Button className="flex h-6 items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md" key={category.name}>
                    {category.icon}
                    {category.name}
                </Button>
                :
                <div className="flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-all duration-300" key={category.name} onClick={() => handleChange(category.slug)}>
                    {category.icon}
                    {category.name}
                </div>
            ))}
        </div>
    )
}
