import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({subsets : ['latin'], variable: "--font-inter"})

export const metadata: Metadata = {
  title: "Transaction Tracker",
  description: "Transaction tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${inter.variable} antialiased`}>
            <Navbar/>
            {children}
        </body>
    </html>
  );
}
