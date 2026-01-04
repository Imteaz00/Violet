import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Violet",
    description: "Platform for sharing you cosmetics",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="dark antialiased">
                <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:mx-w-2xl lg:max-w-3xl xl:max-w-6xl">
                    <Navbar></Navbar>
                    {children}
                    <Footer></Footer>
                </div>
            </body>
        </html >
    );
}
