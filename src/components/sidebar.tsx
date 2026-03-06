"use client";

import { useState } from "react";

type MenuItemProps = {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
};

function MenuItem({ label, isActive = false, onClick }: MenuItemProps) {
    return (
        <div>
            <span
                onClick={onClick}
                className={`select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem] transition-all duration-200 ${
                    isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-stone-500 hover:bg-slate-100 hover:text-dark"
                }`}
            >
                <a
                    href="#"
                    className="flex items-center grow text-[1.15rem]"
                    onClick={(e) => e.preventDefault()}
                >
                    {label}
                </a>
            </span>
        </div>
    );
}

export default function Sidebar() {
    const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    return (
        <div className="bg-white">
            <div className="container flex flex-col mx-auto bg-white">
                <aside
                    className="group/sidebar flex flex-col shrink-0 lg:w-[300px] w-[250px] transition-all duration-300 ease-in-out m-0 fixed z-40 inset-y-0 left-0 bg-white border-r border-r-dashed border-r-neutral-200 sidenav fixed-start loopple-fixed-start"
                    id="sidenav-main"
                >
                    <div className="flex shrink-0 px-8 items-center justify-between h-[96px]">
                        <a className="transition-colors duration-200 ease-in-out hover:opacity-80" href="https://www.loopple.com">
                            <img
                                alt="Logo"
                                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/logos/loopple.svg"
                                className="inline"
                            />
                        </a>
                    </div>

                    <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200" />

                    <div className="relative pl-3 my-5 overflow-y-scroll flex-1">
                        <div className="flex flex-col w-full font-medium">
                            <MenuItem 
                                label="Dashboard" 
                                isActive={activeMenu === "Dashboard"}
                                onClick={() => setActiveMenu("Dashboard")}
                            />
                            <MenuItem 
                                label="Class Schedule" 
                                isActive={activeMenu === "Class Schedule"}
                                onClick={() => setActiveMenu("Class Schedule")}
                            />
                            <MenuItem 
                                label="List User" 
                                isActive={activeMenu === "List User"}
                                onClick={() => setActiveMenu("List User")}
                            />
                            <MenuItem 
                                label="List Subject" 
                                isActive={activeMenu === "List Subject"}
                                onClick={() => setActiveMenu("List Subject")}
                            />
                            <MenuItem 
                                label="List Class" 
                                isActive={activeMenu === "List Class"}
                                onClick={() => setActiveMenu("List Class")}
                            />

                            <div className="block pt-5 pb-[.15rem]">
                                <div className="px-4 py-[.65rem]">
                                    <span className="font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                                        System
                                    </span>
                                </div>
                            </div>

                            <MenuItem 
                                label="Settings" 
                                isActive={activeMenu === "Settings"}
                                onClick={() => setActiveMenu("Settings")}
                            />
                            <MenuItem 
                                label="Log out" 
                                isActive={activeMenu === "Log out"}
                                onClick={() => setActiveMenu("Log out")}
                            />
                        </div>
                    </div>

                    <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200" />

                    <div className="relative mt-auto">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex w-full items-center justify-between px-8 py-5 transition-all duration-200 hover:bg-slate-50"
                        >
                            <div className="flex items-center mr-5">
                                <div className="mr-5">
                                    <div className="inline-block relative shrink-0 cursor-pointer rounded-[.95rem] transition-transform duration-200 hover:scale-105">
                                        <img
                                            className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem]"
                                            src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                                            alt="avatar image"
                                        />
                                    </div>
                                </div>
                                <div className="mr-2">
                                    <a
                                        href="#"
                                        className="dark:hover:text-primary hover:text-primary transition-colors duration-200 ease-in-out text-[1.075rem] font-medium dark:text-neutral-400/90 text-secondary-inverse"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Ahmad Haidar El Haq
                                    </a>
                                    <span className="text-secondary-dark dark:text-stone-500 font-medium block text-[0.85rem]">
                                        Super Admin
                                    </span>
                                </div>
                            </div>
                            <span className={`leading-none transition-all duration-300 peer shrink-0 group-hover:text-primary text-secondary-dark ${
                                showProfileMenu ? "rotate-180" : ""
                            }`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </span>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg bg-white border border-slate-200 shadow-lg z-50">
                                <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors rounded-t-lg">
                                    Profile
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                                    Preferences
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            
        </div>
    );
}