import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Changed the import to use the file you actually have
import PageAssistant from "@/components/PageAssistant"; 
import NetworkStatus from "@/components/NetworkStatus";
import ServiceWorkerRegistry from "@/components/ServiceWorkerRegistry";

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
  
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
  },
};
   export const viewport: Viewport = {
     themeColor: "#1e3a8a",
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
        {/* 2. Replaced the missing widget with your actual component */}
        <PageAssistant />
      </body>
    </html>
  );
}