import AppShell from "@/src/components/common/app-shell";
import HeaderContent from "@/src/components/common/header-content";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="w-full">
            <AppShell>
                <HeaderContent />
                {children}
            </AppShell>
        </main>
    )
}