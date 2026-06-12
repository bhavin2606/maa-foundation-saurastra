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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4 shadow-sm">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-sm font-black tracking-tight text-secondary">
            Maa <span className="text-primary italic">Foundation</span>
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-secondary hover:bg-surface rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-premium transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-6 py-4 lg:h-[72px]">
          <Link href="/admin" className="flex items-center gap-2 transition-all hover:opacity-90">
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight text-secondary">
                Maa <span className="text-primary italic">Foundation</span>
              </span>
              <span className="mt-1 text-[8px] font-black uppercase tracking-[0.25em] text-muted">
                Admin Panel
              </span>
            </div>
          </Link>
          <button 
            className="lg:hidden p-1 text-muted hover:text-secondary rounded-lg hover:bg-surface"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 mt-2 lg:mt-6">
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
                    ? "bg-secondary text-white shadow-premium lg:scale-105"
                    : "text-muted hover:bg-surface hover:text-secondary translate-x-0 lg:hover:translate-x-1"
                }`}
              >
                <link.icon size={18} className={isActive ? "text-primary" : ""} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 space-y-2 bg-white mt-auto">
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
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:p-10 bg-white min-h-screen relative overflow-hidden max-w-[100vw]">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[100px] pointer-events-none hidden lg:block" />
        <div className="relative z-10 w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

