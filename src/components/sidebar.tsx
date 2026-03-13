"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDEBAR_MENU_LIST } from "@/src/constants/sidebar-constant";

type MenuItemProps = {
    label: string;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
};

function MenuItem({ label, icon, href, isActive = false }: MenuItemProps) {
    return (
        <Link
            href={href}
            className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[28px] transition-colors duration-200 ${isActive ? "bg-white/70 text-slate-700" : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                }`}
        >
            <span className="text-slate-500">{icon}</span>
            <span className="grow text-[0.98rem]">{label}</span>
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const adminMenuList = SIDEBAR_MENU_LIST.admin;

    return (
        <aside
            id="sidenav-main"
            className="fixed inset-y-0 left-0 z-40 flex w-65 flex-col overflow-hidden border-r border-slate-200 bg-[#e3e3e5]">
            <div className="relative h-45 w-full overflow-hidden bg-[#f79a50]">
                <button
                    className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-white"
                    aria-label="Toggle sidebar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="absolute -bottom-1 left-0 h-27.5 w-[115%] -translate-x-[10%] rounded-[58%] bg-[#e3e3e5]" />
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4">
                <p className="px-3 text-sm text-slate-500">Menu Utama</p>

                <div className="mt-3 space-y-1">
                    {adminMenuList.map((menu) => {
                        const Icon = menu.icon;
                        const isActive = pathname === menu.url || pathname.startsWith(`${menu.url}/`);

                        return (
                            <MenuItem
                                key={menu.url}
                                label={menu.title}
                                href={menu.url}
                                icon={<Icon size={18} />}
                                isActive={isActive}
                            />
                        );
                    })}
                </div>

                <div className="mx-2 mt-5 border-t border-slate-300" />

                <p className="px-3 pt-4 text-sm text-slate-500">Sistem</p>

                <div className="mt-2 space-y-1">
                    <MenuItem
                        label="Pengaturan"
                        href="#"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.7" />
                                <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6h.1a1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                        }
                        isActive={pathname === "/pengaturan"}
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
                    />
                </div>
            </div>

            <div className="border-t border-slate-300 px-5 py-4">
                <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/60">
                    <img
                        className="h-9 w-9 rounded-full object-cover"
                        src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                        alt="profile"
                    />
                    <span className="block">
                        <span className="block text-[0.96rem] text-[#f79a50]">Ahmad Haidar El Haq</span>
                        <span className="block text-xs text-slate-500">Super Admin</span>
                    </span>
                </button>
            </div>
        </aside>
    );
}