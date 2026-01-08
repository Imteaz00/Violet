import Appsidebar from "@/components/admin/Appsidebar";
import Navbar from "@/components/admin/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BACKEND_URL } from "@/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

// async function checkAdmin() {
//     const { userId } = await auth();
//     const user = await currentUser()

//     if (!userId || !user) {
//         redirect("/", RedirectType.replace)
//     }

// const userData = await fetch(`${BACKEND_URL}/get`)
//     if (userData.role !== "admin") {
//         redirect("/", RedirectType.replace)
//     }
// }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await checkAdmin()
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <div className="flex">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Appsidebar />
        <div className="w-full">
          <Navbar />
          <div className="px-4">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
