import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart fill="var(--color-primary)" className="text-primary" size={24} />
              <span className="text-lg font-bold">Maa Foundation</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Empowering the underprivileged through compassion, community, and
              sustained action. Together we create lasting change.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {["About", "Campaigns", "Reels", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm text-gray-300 transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Mail size={14} /> contact@maafoundation.org
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} /> +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Mumbai, India
              </span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Stay Connected
            </h4>
            <p className="text-sm text-gray-300">
              Get updates on our latest initiatives.
            </p>
            <div className="flex overflow-hidden rounded-full bg-white/10">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-400"
              />
              <button className="bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Maa Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
