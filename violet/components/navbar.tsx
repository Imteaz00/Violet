import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import ShoppingBagIcon from "./ShoppingBagIcon";

export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between border-b pb-4">

            <Link href="/" className="flex items-center">
                <h1 className="text-4xl text-primary font-semibold tracking-wider"> {/* hidden md:block */}
                    VIOLET
                </h1>
            </Link>
            <div className="flex items-center gap-6">

                <SearchBar />
                <Bell className="w-4 h-4 text-foreground" />
                <ShoppingBagIcon />
                <Button> Sign In</Button>
            </div>
        </nav>
    )

}