import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "No.One",
    template: "%s | No.One",
  },

  description:
    "The Digital Headquarters of Vinayak Joshi.",

  applicationName: "No.One",

  authors: [{ name: "Vinayak Joshi" }],

  creator: "Vinayak Joshi",

  keywords: [
    "Vinayak Joshi",
    "No.One",
    "Founder",
    "Portfolio",
    "AI",
    "Startups",
    "Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}