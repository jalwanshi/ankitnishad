"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { getProfile } from "@/services/profileService";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<any>({ fullName: "Ankit Nishad", roleTitle: "", email: "", location: "" });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadHeaderData() {
      try {
        const p = await getProfile();
        if (p) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load header data:", err);
      }
    }
    loadHeaderData();
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Career", href: "/career" },
    { name: "Expertise", href: "/expertise" },
    { name: "Services", href: "/services" },
    { name: "Work", href: "/work" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-main-bg/80 backdrop-blur-md border-b border-border-grey py-2 md:py-3"
          : "bg-transparent py-4 md:py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/assets/logo.png" 
            alt="Ankit Nishad Logo" 
            className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-sm"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-sans text-xs uppercase tracking-widest transition-colors relative py-1 hover:text-primary-black ${
                  isActive ? "text-primary-black font-semibold" : "text-muted-grey"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-black animate-scale-x" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Call to Action Button */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-5 py-2.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
          >
            Let's Talk
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-primary-black focus:outline-none p-1.5 border border-border-grey hover:bg-soft-bg transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-main-bg z-40 border-t border-border-grey flex flex-col justify-between p-6 animate-fade-in">
          <nav className="flex flex-col space-y-6 pt-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-display text-2xl uppercase tracking-wider ${
                    isActive ? "text-primary-black font-medium" : "text-muted-grey"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pb-8 flex flex-col gap-4">
            <div className="h-[1px] bg-border-grey w-full my-4" />
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-primary-black text-white py-4 text-sm font-sans uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-semibold"
            >
              Let's Talk
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <p className="text-center text-[10px] uppercase tracking-widest text-muted-grey mt-2">
              {profile.location || "Noida, India"} • {profile.email}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
