import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import PageTransition from "@/components/transitions/PageTransition";
import AmbientGlow from "@/components/effects/AmbientGlow";
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
    // suppressHydrationWarning is required by next-themes: it sets the
    // theme class on <html> via an inline script before React
    // hydrates, so the server-rendered markup and the first client
    // render intentionally differ on this one attribute. Without this,
    // React would (correctly, but unhelpfully here) warn about a
    // hydration mismatch on every page load.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex min-h-screen flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AmbientGlow />
          <div aria-hidden="true" className="grain-overlay" />
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
