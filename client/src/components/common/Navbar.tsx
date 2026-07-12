"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Work", path: "/work" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-secondary shadow-premium py-3"
        : "bg-secondary/95 py-6"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex maa-foundation-logo.pngitems-center transition-all hover:opacity-90">
          <div className="bg-transparent">
            <Image src="/images/maa-foundation-logo.png" alt="Maa Foundation Logo" width={100} height={100} className="object-contain" priority />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-12 lg:flex">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative text-xs font-bold uppercase tracking-[0.15em] transition-all hover:text-primary ${isActive ? "text-primary" : "text-slate-300"
                    }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
                </Link>
              );
            })}
          </div>
          <Link
            href="/donate"
            className="rounded-full bg-secondary px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-secondary/90 shadow-sm"
          >
            Donate Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-colors hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-4 rounded-3xl bg-secondary border border-white/10 p-8 shadow-2xl lg:hidden flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xl font-black text-white uppercase tracking-tight"
            >
              {link.name}
              <ChevronRight size={20} className="text-primary" />
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 rounded-2xl bg-white/10 px-6 py-4 text-center text-lg font-bold text-white shadow-sm border border-white/20"
          >
            Donate Now
          </Link>
        </div>
      )}
    </nav>
  );
}
