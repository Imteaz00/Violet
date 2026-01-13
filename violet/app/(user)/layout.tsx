import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SyncOnMount from "@/components/SyncOnMount";

export const metadata: Metadata = {
  title: "Violet",
  description: "Platform for sharing your cosmetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
      <Navbar />
      <SyncOnMount />
      {children}
      <Footer />
    </div>
  );
}
