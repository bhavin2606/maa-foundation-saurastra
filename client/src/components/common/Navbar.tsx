"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Campaigns", path: "/campaigns" },
  { name: "Reels", path: "/reels" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 py-3 shadow-lg backdrop-blur-md"
          : "bg-white/80 py-5 backdrop-blur-sm"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
            <Heart fill="currentColor" size={22} />
          </div>
          <span className="text-2xl font-black text-secondary tracking-tighter">
            Maa Foundation
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative text-sm font-bold uppercase tracking-widest transition-all hover:text-primary ${
                    isActive ? "text-primary" : "text-secondary/70"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
          <Link
            href="/donate"
            className="rounded-full bg-secondary px-8 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-primary hover:shadow-primary/30 active:scale-95"
          >
            Donate Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-secondary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-6 shadow-2xl lg:hidden flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 text-lg font-bold text-secondary border-b border-gray-50"
            >
              {link.name}
              <ChevronRight size={18} className="text-primary" />
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 rounded-xl bg-primary px-6 py-4 text-center text-lg font-bold text-white shadow-lg"
          >
            Donate Now
          </Link>
        </div>
      )}
    </nav>
  );
}
