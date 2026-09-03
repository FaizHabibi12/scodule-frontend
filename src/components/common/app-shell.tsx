"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
      setIsSidebarOpen(!mediaQuery.matches);
    };
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (isAuthRoute) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
      {isMobile && !isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Buka menu navigasi"
          className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition hover:scale-105 active:scale-95"
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {isMobile && isSidebarOpen && <button type="button" aria-label="Tutup menu" onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px]" />}
      <main className={`dashboard-main min-w-0 transition-all duration-300 ${isSidebarOpen && !isMobile ? "lg:pl-65" : "lg:pl-20"}`}>{children}</main>
    </div>
  );
}
