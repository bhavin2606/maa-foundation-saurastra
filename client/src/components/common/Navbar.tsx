"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-morphism py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3 group transition-all hover:opacity-90">
          <div className="flex flex-col leading-none">
            <span className="text-xl lg:text-2xl font-black tracking-tight text-secondary">
              Maa <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">Foundation</span>
            </span>
            <span className="mt-1 text-[9px] font-black uppercase tracking-[0.3em] text-secondary/50">
              Seva • Shiksha • Sanskar
            </span>
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
                  className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                    isActive ? "text-primary" : "text-secondary/60"
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
                </Link>
              );
            })}
          </div>
          <Link
            href="/donate"
            className="group relative overflow-hidden rounded-full bg-secondary px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-premium transition-all hover:bg-primary hover:-translate-y-1 active:scale-95"
          >
            <span className="relative z-10">Donate Now</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/5 text-secondary transition-colors hover:bg-secondary/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-4 rounded-3xl glass-morphism p-8 shadow-2xl lg:hidden flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xl font-black text-secondary uppercase tracking-tight"
            >
              {link.name}
              <ChevronRight size={20} className="text-primary" />
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-5 text-center text-lg font-black text-white shadow-glow"
          >
            Donate Now
          </Link>
        </div>
      )}
    </nav>
  );
}
