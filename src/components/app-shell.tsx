"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="pl-[260px]">{children}</main>
    </div>
  );
}
