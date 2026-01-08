import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import ShoppingBagIcon from "./ShoppingBagIcon";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ButtonGroup } from "./ui/button-group";
import { ModeToggle } from "./ui/mode-toggle";
import { syncUserIfNeeded } from "@/app/(user)/actions/user.action";

export default async function Navbar() {
  await syncUserIfNeeded();
  return (
    <nav className="w-full flex items-center justify-between border-b pb-4">
      <Link href="/" className="flex items-center">
        <h1 className="text-4xl text-primary font-semibold tracking-wider">
          {" "}
          {/* hidden md:block */}
          VIOLET
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <SearchBar />
        <ModeToggle />
        <Bell className="w-4 h-4 text-foreground" />
        <ShoppingBagIcon />
        <SignedOut>
          <ButtonGroup>
            <SignInButton mode="modal">
              <Button variant={"secondary"} className="w-17">
                <span className="transition-transform duration-300 hover:scale-110 hover:text-accent-foreground">
                  Sign In
                </span>
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-17">
                <span className="transition-transform duration-300 hover:scale-110">Sign Up</span>
              </Button>
            </SignUpButton>
          </ButtonGroup>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
