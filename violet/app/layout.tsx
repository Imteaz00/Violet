import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastContainer } from "react-toastify";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
