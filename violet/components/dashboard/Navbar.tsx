import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-3.5 flex items-center justify-between border-b mb-1">
      <div className="flex gap-4">
        <SidebarTrigger />
        <span className="text-muted-foreground text-2xl">|</span>

        <h1 className="pl-4 text-2xl hover:underline hover:underline-offset-4 hover:cursor-pointer hover:text-accent-foreground">
          <Link href="/dashboard">DashBoard</Link>
        </h1>
      </div>
      <ModeToggle />
    </nav>
  );
}
