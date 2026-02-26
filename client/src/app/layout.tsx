import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import Footer from "@/components/Footer";
import MuiProvider from "@/components/MuiProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CK Electric - Puget Sound",
  description: "Professional electrical services in Tacoma to Skagit Valley",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <MuiProvider>
          <HeaderClient />
          <main>
            {children}
          </main>
          <Footer />
        </MuiProvider>
      </body>
    </html>
  );
}
