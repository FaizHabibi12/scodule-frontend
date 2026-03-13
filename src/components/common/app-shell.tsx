"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isAuthRoute) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
      <main className={`transition-all duration-300 ${isSidebarOpen ? "pl-65" : "pl-20"}`}>{children}</main>
    </div>
  );
}
