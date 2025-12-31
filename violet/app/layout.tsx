import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";

export const metadata: Metadata = {
  title: "Violet",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
