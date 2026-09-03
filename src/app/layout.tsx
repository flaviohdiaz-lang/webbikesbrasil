import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import SiteNav from "@/components/SiteNav";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebBikesBrasil — Comprar e vender bicicletas",
  description: "Seu marketplace de bicicletas novas e usadas de todo o Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
        <body className="flex min-h-full flex-col font-sans">
          <PromoBanner />
          <SiteNav />
          <div className="flex-1">{children}</div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
