import Link from "next/link";
import SearchBar from "./SearchBar";
import { LayoutDashboard, LayoutDashboardIcon, LucideLayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import ShoppingBagIcon from "./ShoppingBagIcon";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ButtonGroup } from "./ui/button-group";
import { ModeToggle } from "./ui/mode-toggle";
import { Suspense } from "react";

export default async function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between border-b pb-4 bg-secondary rounded-lg px-4 pt-3 shadow-md">
      <Link href="/" className="flex items-center">
        <h1 className="text-4xl text-primary font-semibold tracking-wider">
          {" "}
          {/* hidden md:block */}
          VIOLET
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <Suspense fallback={<div className="w-48 h-10 bg-muted animate-pulse rounded" />}>
          <SearchBar />
        </Suspense>
        <ModeToggle />
        <ShoppingBagIcon />
        <Link
          href="/dashboard"
          title="Dashboard"
          className="hidden md:flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer duration-300 hover:scale-110"
        >
          <LayoutDashboardIcon className="w-4 h-4" />
        </Link>
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
