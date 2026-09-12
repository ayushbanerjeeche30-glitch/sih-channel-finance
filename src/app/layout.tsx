import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageAssistant from "@/components/PageAssistant"; 
import NetworkStatus from "@/components/NetworkStatus";
import ServiceWorkerRegistry from "@/components/ServiceWorkerRegistry";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamruddhiSetu — Channel Finance System",
  description: "Channel Finance System for SC Beneficiaries",
  manifest: "/manifest.json",
  themeColor: "#1e3a8a",
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistry />
        <NetworkStatus />
        {children}
        <PageAssistant />
        <ThemeToggle />
      </body>
    </html>
  );
}
