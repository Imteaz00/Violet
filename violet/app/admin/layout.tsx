import checkAdmin from "@/actions/checkAdmin";
import Appsidebar from "@/components/admin/Appsidebar";
import Navbar from "@/components/admin/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkAdmin();
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
