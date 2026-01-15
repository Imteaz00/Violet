import Appsidebar from "@/components/dashboard/Appsidebar";
import Navbar from "@/components/dashboard/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in", RedirectType.replace);
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <div className="flex bg-sidebar">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Appsidebar />
        <div className="w-full relative min-h-screen bg-secondary rounded-tl-4xl shadow-lg -ml-px overflow-hidden">
          <Navbar />
          <div className="px-4">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
