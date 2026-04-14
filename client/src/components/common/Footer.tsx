import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-secondary overflow-hidden pt-24 pb-12">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group transition-all hover:opacity-90">
              <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 shadow-glow transition-transform group-hover:scale-105">
                <div className="text-lg font-black tracking-tight text-white leading-none">
                  Maa <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">Foundation</span>
                </div>
                <div className="mt-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Seva • Shiksha • Sanskar • Paryavaran
                </div>
              </div>
            </Link>
            <p className="text-base leading-relaxed text-slate-400 font-medium">
              Compassion with action. हम daily seva, शिक्षा support, dharmik restoration,
              bird care, ayurvedic वृक्षारोपण और sanatan katha के माध्यम से community impact बनाते हैं।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Navigation
            </h4>
            <div className="flex flex-col gap-4">
              {["About", "Work", "Campaigns", "Reels", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-bold text-slate-300 transition-colors hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Connect
            </h4>
            <div className="flex flex-col gap-6 text-sm">
              {[
                { icon: <Mail size={18} />, value: "contact@maafoundation.org" },
                { icon: <Phone size={18} />, value: "+91 98765 43210" },
                { icon: <MapPin size={18} />, value: "Mumbai, Maharashtra, India" },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-4 text-slate-300 font-medium hover:text-white transition-colors cursor-default">
                  <span className="text-primary">{item.icon}</span> {item.value}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Join Our Mission
            </h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Subscribe for updates on our latest initiatives and impact stories.
            </p>
            <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-primary/50 transition-all">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button className="bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:shadow-glow active:scale-95">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>© {new Date().getFullYear()} Maa Foundation. All rights reserved.</span>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
