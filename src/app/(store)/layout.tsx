import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GlowCart — Premium Beauty Devices & Hygiene Care",
  description:
    "Clinic-quality beauty devices and complete hygiene care packages. LED therapy masks, facial tools, skincare bundles, and more.",
  keywords: "beauty devices, skincare, hygiene care, facial tools, LED mask, teeth whitening",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
