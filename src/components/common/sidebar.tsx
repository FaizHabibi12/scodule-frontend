"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDEBAR_MENU_LIST } from "@/src/constants/sidebar-constant";
import Image from "next/image";

type MenuItemProps = {
    label: string;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
    isCollapsed?: boolean;
};

type ChildMenu = {
    title: string;
    url: string;
};

type SidebarMenu = {
    title: string;
    url: string;
    icon: React.ComponentType<{ size?: number }>;
    exact?: boolean;
    children?: ChildMenu[];
};

type SidebarProps = {
    isOpen: boolean;
    onToggle: () => void;
};

type HoverTooltipProps = {
    label: string;
};

function HoverTooltip({ label }: HoverTooltipProps) {
    return (
        <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 z-50 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-[0_10px_30px_rgba(15,23,42,0.24)] ring-1 ring-white/10 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            {label}
            <span className="absolute -left-1.25 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-xs bg-slate-900 ring-1 ring-white/10" />
        </span>
    );
}

function MenuItem({ label, icon, href, isActive = false, isCollapsed = false }: MenuItemProps) {
    return (
        <Link
            href={href}
            title={isCollapsed ? label : undefined}
            aria-label={isCollapsed ? label : undefined}
            className={`group relative flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-all duration-300 ease-out ${isCollapsed ? "justify-center" : "gap-3"} ${isActive ? "bg-white/70 text-slate-700 shadow-[0_6px_18px_rgba(148,163,184,0.14)]" : "text-slate-500 hover:bg-white/50 hover:text-slate-700 hover:shadow-[0_6px_18px_rgba(148,163,184,0.1)]"}`}>
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ease-out ${isActive ? "bg-primary text-white shadow-[0_8px_20px_rgba(247,154,80,0.3)]" : "text-slate-500 group-hover:bg-white/70 group-hover:text-slate-700"}`}>{icon}</span>
            {!isCollapsed && <span className="grow text-[0.98rem] transition-all duration-300">{label}</span>}
            {isCollapsed && <HoverTooltip label={label} />}
        </Link>
    );
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const adminMenuList = SIDEBAR_MENU_LIST.admin as SidebarMenu[];
    const [isDaftarUserOpen, setIsDaftarUserOpen] = useState(pathname.startsWith("/admin/daftar-user"));

    const isMenuActive = (url: string, exact = false) => {
        if (exact) {
            return pathname === url;
        }

        return pathname === url || pathname.startsWith(`${url}/`);
    };

    useEffect(() => {
        if (pathname.startsWith("/admin/daftar-user")) {
            setIsDaftarUserOpen(true);
        }
    }, [pathname]);

    return (
        <aside
            id="sidenav-main"
            className={`fixed inset-y-0 left-0 z-40 flex min-h-screen flex-col overflow-visible bg-[#ffffff] transition-all duration-300 ease-out ${isOpen ? "w-70" : "w-20"}`}>
            <div className={`relative w-full transition-all duration-300 ${isOpen ? "h-45" : "h-20"}`}>
                <button
                    type="button"
                    onClick={onToggle}
                    className={`absolute top-5 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 shadow-sm transition-all duration-300 ease-out hover:scale-105 ${isOpen ? " bg-white/90 right-4" : "bg-primary right-0 transform -translate-x-1/2"}`}
                    aria-label="Toggle sidebar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180 text-white"}`}>
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <Image src="/union.svg" alt="Logo" width={280} height={40} className={` ${isOpen ? "" : "hidden"}`} />
            </div>

            <div className={`justify-between pb-4 pt-4 ${isOpen ? "px-5 overflow-auto mt-20" : "px-2"}`}>
                <div className="min-h-0">
                    {isOpen && <p className="px-3 text-sm text-slate-500 transition-opacity duration-300">Menu Utama</p>}
                    <div className="mt-3 space-y-1">
                        {adminMenuList.map((menu) => {
                            const Icon = menu.icon;
                            const childMenus = menu.children ?? [];
                            const isSubmenu = childMenus.length > 0;
                            const isActive = isMenuActive(menu.url, menu.exact);

                            if (isSubmenu) {
                                if (!isOpen) {
                                    const collapsedTargetUrl = childMenus.find((child) => child.title.toLowerCase() === "pelajar")?.url ?? childMenus[0]?.url ?? menu.url;

                                    return (
                                        <MenuItem
                                            key={menu.url}
                                            label={menu.title}
                                            href={collapsedTargetUrl}
                                            icon={<Icon size={18} />}
                                            isActive={isActive}
                                            isCollapsed
                                        />
                                    );
                                }

                                return (
                                    <div key={menu.url}>
                                        <button
                                            type="button"
                                            onClick={() => setIsDaftarUserOpen((prev) => !prev)}
                                            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-300 ease-out ${isActive ? "bg-white/70 text-slate-700 shadow-[0_6px_18px_rgba(148,163,184,0.14)]" : "text-slate-500 hover:bg-white/50 hover:text-slate-700 hover:shadow-[0_6px_18px_rgba(148,163,184,0.1)]"}`}>
                                            <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ease-out ${isActive ? "bg-primary text-white shadow-[0_8px_20px_rgba(247,154,80,0.3)]" : "text-slate-500 group-hover:bg-white/70 group-hover:text-slate-700"}`}>
                                                <Icon size={18} />
                                            </span>
                                            <span className="grow text-[0.98rem] transition-all duration-300">{menu.title}</span>
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className={`transition-transform duration-300 ease-out ${isDaftarUserOpen ? "rotate-90" : "rotate-0"}`}>
                                                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        <div className={`grid overflow-hidden transition-all duration-300 ease-out ${isDaftarUserOpen ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                            <div className="min-h-0">
                                                <div className="ml-8 space-y-1 border-l border-slate-300 pl-3 pb-1 pt-1">
                                                    {childMenus.map((child) => {
                                                        const isChildActive = pathname === child.url || pathname.startsWith(`${child.url}/`);

                                                        return (
                                                            <Link
                                                                key={child.url}
                                                                href={child.url}
                                                                className={`block rounded-lg px-3 py-2 text-sm transition-all duration-200 ease-out ${isChildActive ? "bg-white/70 text-slate-700" : "text-slate-500 hover:bg-white/50 hover:text-slate-700"}`}>
                                                                {child.title}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <MenuItem
                                    key={menu.url}
                                    label={menu.title}
                                    href={menu.url}
                                    icon={<Icon size={18} />}
                                    isActive={isActive}
                                    isCollapsed={!isOpen}
                                />
                            );
                        })}
                    </div>

                    {isOpen && <div className="mx-2 mt-5 border-t border-slate-300" />}

                    {isOpen && <p className="px-3 pt-4 text-sm text-slate-500 transition-opacity duration-300">Sistem</p>}

                    <div className="mt-2 space-y-1">
                        <MenuItem
                            label="Pengaturan"
                            href="/pengaturan"
                            icon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.7" />
                                    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6h.1a1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z" stroke="currentColor" strokeWidth="1.3" />
                                </svg>
                            }
                            isActive={pathname === "/pengaturan"}
                            isCollapsed={!isOpen}
                        />

                        <MenuItem
                            label="Logout"
                            href="#"
                            icon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                    <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                            isActive={false}
                            isCollapsed={!isOpen}
                        />
                    </div>
                </div>

                <div className={`border-t border-slate-300 pt-4 ${isOpen ? "mt-4" : "mt-3"}`}>
                    <button
                        title={!isOpen ? "Ahmad Haidar El Haq" : undefined}
                        aria-label={!isOpen ? "Ahmad Haidar El Haq" : undefined}
                        className={`group relative flex w-full rounded-xl px-2 py-2 text-left transition-all duration-300 ease-out hover:bg-white/60 ${isOpen ? "items-center gap-3" : "justify-center"}`}>
                        <img
                            className="h-9 w-9 rounded-full object-cover"
                            src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                            alt="profile"
                        />
                        {isOpen ? (
                            <span className="block transition-opacity duration-300">
                                <span className="block text-[0.96rem] text-[#f79a50]">Ahmad Haidar El Haq</span>
                                <span className="block text-xs text-slate-500">Super Admin</span>
                            </span>
                        ) : (
                            <HoverTooltip label="Ahmad Haidar El Haq" />
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}