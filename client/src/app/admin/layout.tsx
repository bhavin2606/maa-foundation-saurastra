"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
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
import { RootState } from "@/store/store";
import { logout as logoutAction } from "@/store/slices/authSlice";

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
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  // Define public paths that don't need auth (within /admin)
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    } else if (isAuthenticated && isLoginPage) {
      router.replace("/admin");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, isLoginPage, router]);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/admin/login");
  };

  // While checking or if we're on login page, don't show the sidebar layout
  if (isChecking || isLoginPage) {
    return isLoginPage ? <>{children}</> : (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-premium">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2 transition-all hover:opacity-90">
            <div className="h-8 w-auto min-w-[100px]">
              <img 
                src="/logo.png" 
                alt="Maa Foundation" 
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="text-xs font-black text-secondary uppercase tracking-[0.2em] border-l border-gray-200 pl-3">Admin</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 mt-6">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== "/admin" && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-secondary text-white shadow-premium scale-105"
                    : "text-muted hover:bg-surface hover:text-secondary translate-x-0 hover:translate-x-1"
                }`}
              >
                <link.icon size={18} className={isActive ? "text-primary" : ""} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider text-red-500 transition-all hover:bg-red-50 hover:shadow-inner"
          >
            <LogOut size={18} />
            Logout
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider text-muted transition-all hover:bg-surface hover:text-secondary"
          >
            <HelpCircle size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10 bg-white min-h-screen relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
