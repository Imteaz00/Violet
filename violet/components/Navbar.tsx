import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import { Button } from "./ui/button";
import ShoppingBagIcon from "./ShoppingBagIcon";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ButtonGroup } from "./ui/button-group";
import { ModeToggle } from "./ui/mode-toggle";
import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
  const { userId } = await auth();
  return (
    <nav className="w-full flex items-center justify-between border-b pb-4 bg-card rounded-lg px-4 pt-3 shadow-md">
      <Link href="/" className="flex items-center">
        <h1 className="text-4xl text-primary font-semibold tracking-wider font-serif">
          {" "}
          {/* hidden md:block */}
          VIOLET
        </h1>
      </Link>
      <div className="flex items-center md:gap-2">
        <ModeToggle />
        <ShoppingBagIcon />
        <Link
          href="/dashboard"
          title="Dashboard"
          className={
            userId
              ? "items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer duration-300 hover:scale-110"
              : "hidden"
          }
        >
          <LayoutDashboardIcon className="w-4 h-4" />
        </Link>
        <SignedOut>
          <ButtonGroup>
            <SignInButton mode="modal">
              <Button variant="secondary" className="w-12 h-6 md:h-8 md:w-15">
                <span className="transition-transform duration-300 hover:scale-110 hover:text-accent-foreground text-xs md:text-sm">
                  Sign In
                </span>
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-12 h-6 md:h-8 md:w-15">
                <span className="transition-transform duration-300 hover:scale-110 text-xs md:text-sm">
                  Sign Up
                </span>
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
