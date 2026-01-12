import { ModeToggle } from "../ui/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-3.5 flex items-center justify-between border-b mb-1">
      <div className="flex gap-4">
        <SidebarTrigger />
        <span className="text-muted-foreground text-2xl">|</span>

        <h1 className="pl-4 text-2xl">DashBoard</h1>
      </div>
      <ModeToggle />
    </nav>
  );
}
