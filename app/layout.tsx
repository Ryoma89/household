import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseListener from './components/supabaseListener'
import { Toaster } from "@/components/ui/toaster";
// import Header from "./components/layouts/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyMate",
  description: "Your Best Partner in Household Budgeting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseListener />
        <main style={{ height: 'calc(100vh - 120px)'}}>
        {children}
        <Toaster />
        </main>
      </body>
    </html>
  );
}
