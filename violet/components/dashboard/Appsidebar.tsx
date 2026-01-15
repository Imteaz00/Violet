"use client";

import {
  ChevronUp,
  Inbox,
  Package2Icon,
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
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import useBagStore from "@/stores/bagStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMyProductCount } from "@/actions/fetchMyProductsCount";
import { fetchInboxCount } from "@/actions/fetchInboxCount";
import { fetchMyOrderCount } from "@/actions/fetchOrderCount";

const items = [
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
    url: "/dashboard/myOrders",
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
  const { user } = useUser();

  const [myProductsCount, setMyProductsCount] = useState<number | null>(null);
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    fetchMyProductCount()
      .then((count) => setMyProductsCount(count))
      .catch((err) => {
        console.error("Failed to fetch products count:", err);
        setMyProductsCount(0);
      });

    fetchInboxCount()
      .then((count) => setMessageCount(count))
      .catch((err) => {
        console.error("Failed to fetch products count:", err);
        setMessageCount(0);
      });

    fetchMyOrderCount()
      .then((count) => setOrderCount(count))
      .catch((err) => {
        console.error("Failed to fetch orders count:", err);
        setOrderCount(0);
      });
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
                      {item.title === "Inbox" && messageCount !== 0 && <span>{messageCount}</span>}
                      {item.title === "My Bag" && bag.length !== 0 && (
                        <SidebarMenuBadge>{bag.length}</SidebarMenuBadge>
                      )}
                      {item.title === "My Products" && myProductsCount !== 0 && (
                        <SidebarMenuBadge>{myProductsCount}</SidebarMenuBadge>
                      )}
                      {item.title === "My Orders" && orderCount !== 0 && (
                        <SidebarMenuBadge>{orderCount}</SidebarMenuBadge>
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
                    {item.title === "Inbox" && messageCount !== 0 && (
                      <SidebarMenuBadge>{messageCount}</SidebarMenuBadge>
                    )}
                    {item.title === "My Bag" && bag.length !== 0 && (
                      <SidebarMenuBadge>{bag.length}</SidebarMenuBadge>
                    )}
                    {item.title === "My Products" && myProductsCount !== 0 && (
                      <SidebarMenuBadge>{myProductsCount}</SidebarMenuBadge>
                    )}
                    {item.title === "My Orders" && orderCount !== 0 && (
                      <SidebarMenuBadge>{orderCount}</SidebarMenuBadge>
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
                    <User2 /> {user?.fullName || user?.firstName || "User"}{" "}
                    <ChevronUp className="ml-auto" />
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
