import { LuLayoutDashboard } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuChartPie } from "react-icons/lu";
import { MdOutlineAddChart } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { BiLogOut } from "react-icons/bi";

export const SIDEBAR_MENU_LIST = {
    admin: [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: LuLayoutDashboard,
        },
        {
            title: 'Jadwal Kelas',
            url: '/order',
            icon: LuChartPie,
        },
        {
            title: 'Daftar User',
            url: '/admin/daftar-user',
            icon: LuUsers,
        },
        {
            title: 'Daftar Kelas',
            url: '/admin/daftar-kelas',
            icon: LuLayoutDashboard,
        },
        {
            title: 'Daftar Mapel',
            url: '/admin/daftar-mapel',
            icon: LuUsers,
        },
    ],
    student: [
        {
            title: 'Dashboard',
            url: '/student/dashboard',
            icon: LuLayoutDashboard,
        },
    ],
    teacher: [
        {
            title: 'Jadwal Kelas',
            url: '/teacher/jadwal-kelas',
            icon: LuChartPie,
        },
        {
            title: 'Dashboard',
            url: '/teacher/dashboard',
            icon: LuLayoutDashboard,
        },
    ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;