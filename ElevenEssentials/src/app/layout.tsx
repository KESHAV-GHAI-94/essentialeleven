import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Providers } from "./providers";
import { Analytics } from "@/components/analytics/Analytics";
import { CartSync } from "@/components/cart/CartSync";
import { ConditionalLayoutWrapper } from "@/components/layout/ConditionalLayoutWrapper";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essential Eleven | Premium Essentials. Zero Compromise.",
  description: "Discover the perfect balance of form and function with our curated collection of everyday essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "antialiased min-h-screen flex flex-col")}>
        <Providers>
          <Analytics />
          <CartSync />
          <ConditionalLayoutWrapper>
            {children}
          </ConditionalLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
