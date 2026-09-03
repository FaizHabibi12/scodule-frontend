"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const isDark = localStorage.getItem("scodule-theme") === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.dataset.themeReady = "true";
    }, []);

    return children;
}
