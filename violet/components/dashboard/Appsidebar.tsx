"use client";

import {
  ChevronUp,
  Inbox,
  Package2Icon,
  Search,
  ShoppingBagIcon,
  Truck,
  User2,
  ReceiptTextIcon,
  PlusCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import useBagStore from "@/stores/bagStore";
import { usePathname } from "next/navigation";
import { getMyProductsCount } from "@/app/dashboard/action/dashboard.actions";
import { useEffect, useState } from "react";

const items = [
  {
    title: "Search",
    url: "/dashboard",
    icon: Search,
  },
  {
    title: "My Products",
    url: "/dashboard/myProducts",
    icon: Package2Icon,
  },
  {
    title: "Add a Product",
    url: "/dashboard/create",
    icon: PlusCircle,
  },
  {
    title: "My Bag",
    url: "/dashboard/myBag",
    icon: ShoppingBagIcon,
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
  },
  {
    title: "My Orders",
    url: "#",
    icon: Truck,
  },
  {
    title: "Transactions",
    url: "#",
    icon: ReceiptTextIcon,
  },
];

export default function Appsidebar() {
  const pathName = usePathname();
  const { bag } = useBagStore();

  const [myProductsCount, setMyProductsCount] = useState<number | null>(null);

  useEffect(() => {
    getMyProductsCount().then((count) => setMyProductsCount(count));
  }, []);
  return (
    <Sidebar className="border-none">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <span className="text-primary text-3xl font-bold tracking-wider">VIOLET</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                pathName === item.url ? (
                  <SidebarMenuItem key={item.title} className="text-2xl">
                    <Button className="flex justify-between w-full">
                      <div className="flex gap-2">
                        <item.icon /> <span>{item.title}</span>
                      </div>
                      {item.title === "Inbox" && <span>12</span>}
                      {item.title === "My Bag" && <SidebarMenuBadge>{bag.length}</SidebarMenuBadge>}
                      {item.title === "My Products" && (
                        <SidebarMenuBadge>{myProductsCount}</SidebarMenuBadge>
                      )}
                    </Button>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title} className="text-2xl flex">
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Inbox" && <SidebarMenuBadge>12</SidebarMenuBadge>}
                    {item.title === "My Bag" && <SidebarMenuBadge>{bag.length}</SidebarMenuBadge>}
                    {item.title === "My Products" && (
                      <SidebarMenuBadge>{myProductsCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SignedIn>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Jone Doe <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Button variant="ghost">Account</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignOutButton>
                      <Button variant="ghost" className="">
                        Sign Out
                      </Button>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SignedIn>
    </Sidebar>
  );
}
