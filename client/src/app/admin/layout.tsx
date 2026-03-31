"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilmIcon,
  Megaphone,
  IndianRupee,
  Users,
  MessageSquare,
  HelpCircle,
  Heart,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Reels", path: "/admin/reels", icon: FilmIcon },
  { name: "Campaigns", path: "/admin/campaigns", icon: Megaphone },
  { name: "Donations", path: "/admin/donations", icon: IndianRupee },
  { name: "Donors", path: "/admin/donors", icon: Users },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5">
          <Heart fill="var(--color-primary)" className="text-primary" size={24} />
          <span className="text-lg font-bold text-secondary">Admin Panel</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== "/admin" && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
                    : "text-muted hover:bg-gray-50 hover:text-secondary"
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
