import HeaderContent from "@/src/components/header-content";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="w-full">
            <HeaderContent />
            {children}
            <Toaster
                toastOptions={{
                    style: {
                        background: "#000000",
                        color: "#ffffff",
                        border: "1px solid #404040"
                    }
                }}
            />
        </main>
    )
}