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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
  themeColor: "#0a0f0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0f0d" />
      </head>
      <body className={inter.variable}>
        <ClerkProviderWrapper>
          <Providers>{children}</Providers>
        </ClerkProviderWrapper>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(regs) {
              // In local/dev, drop stale SWs that cache old bundles
              if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                regs.forEach(function(r) { r.unregister(); });
                if (window.caches) {
                  caches.keys().then(function(keys) {
                    keys.forEach(function(k) { caches.delete(k); });
                  });
                }
                return;
              }
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `}</Script>
      </body>
    </html>
  );
}

