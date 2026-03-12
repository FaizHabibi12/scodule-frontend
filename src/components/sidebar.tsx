"use client";

import { useState } from "react";

type MenuItemProps = {
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    hasChildren?: boolean;
};

function MenuItem({ label, icon, isActive = false, onClick, hasChildren = false }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[28px] transition-colors duration-200 ${
                isActive ? "bg-white/70 text-slate-700" : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
            }`}
        >
            <span className="text-slate-500">{icon}</span>
            <span className="grow text-[0.98rem]">{label}</span>
            {hasChildren ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-500">
                    <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : null}
        </button>
    );
}

export default function Sidebar() {
    const [activeMenu, setActiveMenu] = useState<string>("Beranda");
    const [showUserSubmenu, setShowUserSubmenu] = useState<boolean>(true);

    return (
        <aside
            id="sidenav-main"
            className="fixed inset-y-0 left-0 z-40 flex w-65 flex-col overflow-hidden border-r border-slate-200 bg-[#e3e3e5]"
        >
            <div className="relative h-45 w-full overflow-hidden bg-[#f79a50]">
                <button
                    className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-white"
                    aria-label="Toggle sidebar"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="absolute -bottom-1 left-0 h-27.5 w-[115%] -translate-x-[10%] rounded-[58%] bg-[#e3e3e5]" />
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4">
                <p className="px-3 text-sm text-slate-500">Menu Utama</p>

                <div className="mt-3 space-y-1">
                    <MenuItem
                        label="Beranda"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke="currentColor" strokeWidth="1.7" />
                            </svg>
                        }
                        isActive={activeMenu === "Beranda"}
                        onClick={() => setActiveMenu("Beranda")}
                    />

                    <MenuItem
                        label="Jadwal Kelas"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M8 3v3M16 3v3M4 9h16M6 6h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                        }
                        isActive={activeMenu === "Jadwal Kelas"}
                        onClick={() => setActiveMenu("Jadwal Kelas")}
                    />

                    <MenuItem
                        label="Daftar User"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        isActive={activeMenu === "Daftar User"}
                        onClick={() => {
                            setActiveMenu("Daftar User");
                            setShowUserSubmenu((prev) => !prev);
                        }}
                        hasChildren
                    />

                    {showUserSubmenu ? (
                        <div className="ml-6 border-l border-slate-400/60 pl-4">
                            <button
                                onClick={() => setActiveMenu("Pelajar")}
                                className={`block w-full rounded-lg py-2 text-left text-[0.98rem] transition ${
                                    activeMenu === "Pelajar" ? "text-slate-700" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Pelajar
                            </button>
                            <button
                                onClick={() => setActiveMenu("Tentor")}
                                className={`block w-full rounded-lg py-2 text-left text-[0.98rem] transition ${
                                    activeMenu === "Tentor" ? "text-slate-700" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Tentor
                            </button>
                        </div>
                    ) : null}

                    <MenuItem
                        label="Daftar Kelas"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M21 12a9 9 0 11-9-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        isActive={activeMenu === "Daftar Kelas"}
                        onClick={() => setActiveMenu("Daftar Kelas")}
                    />

                    <MenuItem
                        label="Daftar Mapel"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12c0-3.3 2.7-6 6-6 1.3 0 2.5.4 3.5 1.1C13.5 5.8 15.2 5 17 5c2.8 0 5 2.2 5 5 0 1.7-.8 3.2-2.1 4.1.1.3.1.6.1.9 0 2.2-1.8 4-4 4H9c-3.3 0-6-2.7-6-6z" stroke="currentColor" strokeWidth="1.7" />
                                <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        isActive={activeMenu === "Daftar Mapel"}
                        onClick={() => setActiveMenu("Daftar Mapel")}
                    />
                </div>

                <div className="mx-2 mt-5 border-t border-slate-300" />

                <p className="px-3 pt-4 text-sm text-slate-500">Sistem</p>

                <div className="mt-2 space-y-1">
                    <MenuItem
                        label="Pengaturan"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.7" />
                                <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6h.1a1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                        }
                        isActive={activeMenu === "Pengaturan"}
                        onClick={() => setActiveMenu("Pengaturan")}
                    />

                    <MenuItem
                        label="Logout"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        isActive={activeMenu === "Logout"}
                        onClick={() => setActiveMenu("Logout")}
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