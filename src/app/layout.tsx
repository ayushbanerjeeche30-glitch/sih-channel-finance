import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Changed the import to use the file you actually have
import PageAssistant from "@/components/PageAssistant"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SamruddhiSetu — Channel Finance System",
  description: "Channel Finance System for SC Beneficiaries",
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
        {children}
        {/* 2. Replaced the missing widget with your actual component */}
        <PageAssistant />
      </body>
    </html>
  );
}