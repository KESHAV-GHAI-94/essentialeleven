import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist — Eleven Essentials",
  description: "View and manage your saved products. Move items to cart or continue browsing our premium collection.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
