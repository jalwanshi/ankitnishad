"use client";

import { usePathname } from "next/navigation";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import GlobalLoader from "@/components/ui/GlobalLoader";
import DynamicSEO from "@/components/seo/DynamicSEO";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiasedScroll`}
    >
      <head>
        <DynamicSEO />
        <meta name="keywords" content="Business Automation, IT Sales, Software Consulting, Workflow Automation, Odoo, CRM Integration, Noida, Ankit Nishad" />
        <meta name="author" content="Ankit Nishad" />
        <link rel="icon" href="/assets/logo.png" type="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://ankitnishad.com" />
        <meta property="og:site_name" content="Ankit Nishad Portfolio" />
      </head>
      <body className="min-h-full flex flex-col bg-main-bg text-text-black font-sans selection:bg-primary-black selection:text-white">
        {!isAdminRoute && <GlobalLoader />}
        {!isAdminRoute && <JsonLd />}
        {!isAdminRoute && <Header />}
        {isAdminRoute ? (
          <>{children}</>
        ) : (
          <main className="flex-grow pt-[80px]">{children}</main>
        )}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
