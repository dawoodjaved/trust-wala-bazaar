import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { ClerkProviderWrapper } from "@/components/auth/clerk-provider-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TrustWala Bazaar - Trusted Marketplace for Pakistan",
  description: "AI-enriched buy/sell platform for mobiles, laptops, electronics, cars, and more in Pakistan",
  keywords: ["marketplace", "Pakistan", "buy", "sell", "trusted", "AI"],
  authors: [{ name: "TrustWala Bazaar" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrustWala Bazaar",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00A651",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00A651" />
      </head>
      <body className={inter.variable}>
        <ClerkProviderWrapper>
          <Providers>{children}</Providers>
        </ClerkProviderWrapper>
        <Script src="/service-worker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

