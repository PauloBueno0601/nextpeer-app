import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/ChatBot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexPeer - P2P Lending",
  description: "A camada de confiança para o crédito descentralizado",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NexPeer",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#34D399",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
