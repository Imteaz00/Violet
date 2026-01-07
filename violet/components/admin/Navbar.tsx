import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";


export default function Navbar() {
    return (
        <nav className="p-4 flex items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
                <Link href="/home">Dashsboard</Link>
                <ModeToggle />
            </div>
        </nav>
    )
}
