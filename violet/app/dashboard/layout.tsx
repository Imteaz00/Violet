import Appsidebar from "@/components/dashboard/Appsidebar";
import Navbar from "@/components/dashboard/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

// async function checkAdmin() {
//     const { userId } = await auth();
//     const user = await currentUser()

//     if (!userId || !user) {
//         redirect("/", RedirectType.replace)
//     }
// }

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await checkAdmin()
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
