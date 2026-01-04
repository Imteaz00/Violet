'use client'
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formaters"
import { BagItemType } from "../../types"
import { CircleDollarSign, Trash2 } from "lucide-react"
import Image from "next/image"

const bagItems: BagItemType[] = [
    {
        id: 1,
        name: "Adidas CoreFit T-Shirt",
        description:
            "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
        price: 39.9,
        images: {
            gray: "/products/1g.png",
            purple: "/products/1p.png",
            green: "/products/1gr.png",
        },
        noOfShares: 4,
        remainingShares: 2,
        shares: 1
    },
    {
        id: 1,
        name: "Adidas CoreFit T-Shirt",
        description:
            "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
        price: 39.9,
        images: {
            gray: "/products/1g.png",
            purple: "/products/1p.png",
            green: "/products/1gr.png",
        },
        noOfShares: 4,
        remainingShares: 2,
        shares: 1
    },
]

const total = formatCurrency(bagItems.reduce((acc, item) => acc + item.price * item.shares, 0))

export default function BagPage() {
    return (
        <div className="flex flex-col gap-8 items-center justify-center mt-12">

            <h1 className="text-2xl font-medium">Your Shopping Bag</h1>

            <div className="w-full flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-7/12 shadow-lg border border-border bg-card p-8 rounded-lg flex flex-col gap-8">
                    {bagItems.map(item => (
                        <div className="flex items-center justify-between" key={item.id}>
                            <div className="flex gap-8">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                                    {/* <Image src={} alt={item.name} fill className="object-contain"/> */}
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Share: {item.shares}</p>
                                        <p className="text-xs text-muted-foreground">Remaining Share: {item.remainingShares}/{item.noOfShares}</p>
                                    </div>
                                    <p className="font-medium">{formatCurrency(item.price)}</p>
                                </div>
                            </div>
                            <Button variant={"destructive"} className="w-8 h-8 duration-300 hover:scale-110 hover:text-accent-foreground">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="w-full h-max lg:w-5/12 shadow-lg border border-border bg-card p-8 rounded-lg flex flex-col gap-6">
                    <h2 className="font-semibold">Details</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Your Balance</p>
                            <p >100</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p>{total}</p>
                        </div>
                    </div>
                    <p className="text-xs text-destructive">Keep enough balance to avoid losing your items</p>
                    <Button className="transition-colors duration-300">
                        <span className="flex items-center gap-2 transition-transform duration-300 pl-10 pr-10 hover:scale-110">
                            <CircleDollarSign />
                            Add Balance
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}