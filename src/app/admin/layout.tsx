"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Sliders,
  FolderClosed,
  MailOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Image as ImageIcon,
  Share2,
  Globe,
  FileText
} from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (currentUser && pathname === "/admin/login") {
        router.push("/admin/dashboard");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Profile & Bio", href: "/admin/profile", icon: <User className="w-4 h-4" /> },
    { name: "Statistics", href: "/admin/statistics", icon: <Sliders className="w-4 h-4" /> },
    { name: "Visual Assets", href: "/admin/assets", icon: <ImageIcon className="w-4 h-4" /> },
    { name: "Career Timeline", href: "/admin/career", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Case Studies", href: "/admin/projects", icon: <FolderClosed className="w-4 h-4" /> },
    { name: "Blog Articles", href: "/admin/blog", icon: <FileText className="w-4 h-4" /> },
    { name: "Contact Enquiries", href: "/admin/enquiries", icon: <MailOpen className="w-4 h-4" /> },
    { name: "Social Links", href: "/admin/socials", icon: <Share2 className="w-4 h-4" /> },
    { name: "Website Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
          <span className="text-xs uppercase tracking-widest text-muted-grey font-semibold">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  // Hide rendering for protected states during redirects
  if (!user && pathname !== "/admin/login") {
    return null;
  }
  if (user && pathname === "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-soft-bg">{children}</div>;
  }

  return (
    <div className="h-screen flex bg-soft-bg text-text-black overflow-hidden">
      {/* Sidebar Wrapper */}
      <aside
        className={`bg-primary-black text-[#A3A3A3] flex flex-col justify-between transition-all duration-300 relative z-30 overflow-y-auto ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Upper Sidebar */}
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#262626] flex items-center justify-between">
            {!isSidebarCollapsed && (
              <span className="font-display text-xs tracking-widest uppercase text-white font-semibold">
                Ankit Nishad Admin
              </span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-white hover:text-white/80 focus:outline-none mx-auto cursor-pointer"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-3 py-3 text-[10px] uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-[#262626] text-white font-semibold"
                      : "hover:bg-[#1E1E1E] hover:text-white"
                  }`}
                >
                  {item.icon}
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar / Logout */}
        <div className="p-4 border-t border-[#262626]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 text-[10px] uppercase tracking-widest hover:bg-[#1E1E1E] hover:text-white transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Window */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        {/* Dashboard Header Navbar */}
        <header className="bg-white border-b border-border-grey py-4 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center">
              <img 
                src="/assets/logo.png" 
                alt="Ankit Nishad Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-soft-bg border border-border-grey px-2.5 py-1 text-primary-black">
              Role: Super Admin
            </span>
          </div>
        </header>

        {/* Body content window */}
        <main className="p-6 md:p-10 flex-1">{children}</main>
      </div>
    </div>
  );
}
