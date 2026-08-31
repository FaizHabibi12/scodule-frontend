import { LuLayoutDashboard } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuChartPie } from "react-icons/lu";
import { LuCalendarCheck } from "react-icons/lu";
import { LuNotebookPen } from "react-icons/lu";
import { LuClock3 } from "react-icons/lu";

export const SIDEBAR_MENU_LIST = {
    admin: [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: LuLayoutDashboard,
            exact: true,
        },
        {
            title: 'Jadwal Kelas',
            url: '/jadwal-kelas',
            icon: LuCalendarCheck,
        },
        {
            title: 'Daftar User',
            url: '/admin/daftar-user',
            icon: LuUsers,
            children: [
                {
                    title: 'Pelajar',
                    url: '/admin/daftar-user/pelajar',
                },
                {
                    title: 'Tentor',
                    url: '/admin/daftar-user/tentor',
                },
            ],
        },
        {
            title: 'Daftar Kelas',
            url: '/admin/daftar-kelas',
            icon: LuChartPie,
        },
        {
            title: 'Daftar Mapel',
            url: '/admin/daftar-mapel',
            icon: LuNotebookPen,
        },
        {
            title: 'Sesi Kelas',
            url: '/admin/sesi',
            icon: LuClock3,
        },
    ],
    student: [
        {
            title: 'Dashboard',
            url: '/student',
            icon: LuLayoutDashboard,
            exact: true,
        },
        {
            title: 'Jadwal Kelas',
            url: '/jadwal-kelas',
            icon: LuCalendarCheck,
        },
    ],
    teacher: [
        {
            title: 'Dashboard',
            url: '/teacher/dashboard',
            icon: LuLayoutDashboard,
            exact: true,
        },
        {
            title: 'Jadwal Kelas',
            url: '/jadwal-kelas',
            icon: LuCalendarCheck,
        },
    ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;