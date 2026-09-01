"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/src/lib/api-client";
import { LuBookOpenText, LuGraduationCap, LuUsers } from "react-icons/lu";
import { toast } from "sonner";

type DashboardSummary = {
    totalTeacher: number;
    totalStudent: number;
    totalPelajaran: number;
    totalKelas: number;
    totalSesi: number;
};

type PaginatedResponse<T> = {
    data?: {
        data?: T[];
    };
};

type DashboardSchedule = {
    id: number;
    day: string;
    classRoom?: { name: string };
    class_room?: { name: string };
    subject?: { name: string };
    teacher?: { user?: { name: string } };
};

export default function DashboardPage() {

    type SubjectResponse = {
        data?: {
            data?: Array<{ id: number }>;
        } | Array<{ id: number }>;
    };


    const [summary, setSummary] = useState<DashboardSummary>({
        totalTeacher: 0,
        totalStudent: 0,
        totalPelajaran: 0,
        totalKelas: 0,
        totalSesi: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [schedules, setSchedules] = useState<DashboardSchedule[]>([]);

    const fetchSummary = useCallback(async () => {
        setIsLoading(true);

        const [teacherRes, studentRes, subjectRes, classRes, sessionRes, scheduleRes] = await Promise.all([
            apiRequest<PaginatedResponse<unknown>>("/admin/teachers?per_page=500"),
            apiRequest<PaginatedResponse<unknown>>("/admin/students?per_page=500"),
            apiRequest<SubjectResponse>("/subjects"),
            apiRequest<{ data?: unknown[] }>("/admin/classes"),
            apiRequest<{ data?: unknown[] }>("/sessions"),
            apiRequest<DashboardSchedule[]>("/admin/schedules"),
        ]);

        if (teacherRes.error || studentRes.error || subjectRes.error || classRes.error || sessionRes.error || scheduleRes.error) {
            toast.error("Gagal memuat ringkasan dashboard", {
                description: teacherRes.error || studentRes.error || subjectRes.error || classRes.error || sessionRes.error || scheduleRes.error || "Terjadi kesalahan saat mengambil data.",
            });
            setIsLoading(false);
            return;
        }

        const teacherCount = teacherRes.data?.data?.data?.length ?? 0;
        const studentCount = studentRes.data?.data?.data?.length ?? 0;

        let subjectCount = 0;
        if (Array.isArray(subjectRes.data?.data)) {
            subjectCount = subjectRes.data?.data.length ?? 0;
        } else {
            subjectCount = subjectRes.data?.data?.data?.length ?? 0;
        }

        setSummary({
            totalTeacher: teacherCount,
            totalStudent: studentCount,
            totalPelajaran: subjectCount,
            totalKelas: Array.isArray(classRes.data?.data) ? classRes.data.data.length : 0,
            totalSesi: Array.isArray(sessionRes.data?.data) ? sessionRes.data.data.length : 0,
        });
        const normalizedSchedules = Array.isArray(scheduleRes.data)
            ? scheduleRes.data.slice(0, 8).map((schedule) => ({
                ...schedule,
                classRoom: schedule.classRoom ?? schedule.class_room ?? { name: '-' },
            }))
            : [];

        setSchedules(normalizedSchedules);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchSummary();
        const refreshTimer = window.setInterval(fetchSummary, 30000);
        return () => window.clearInterval(refreshTimer);
    }, [fetchSummary]);

    return (
        <section className="w-full px-12">
            <div className="mt-6 flex w-full flex-col gap-4">

                <div className="flex flex-wrap gap-4">
                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div>
                            <p className="text-sm text-slate-500">Total Teacher</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">
                                {isLoading ? "..." : summary.totalTeacher}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <LuGraduationCap size={24} />
                        </div>
                    </div>

                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div>
                            <p className="text-sm text-slate-500">Total Student</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">
                                {isLoading ? "..." : summary.totalStudent}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <LuUsers size={24} />
                        </div>
                    </div>

                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div>
                            <p className="text-sm text-slate-500">Total Pelajaran</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">
                                {isLoading ? "..." : summary.totalPelajaran}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <LuBookOpenText size={24} />
                        </div>
                    </div>

                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div><p className="text-sm text-slate-500">Total Kelas</p><p className="mt-2 text-3xl font-semibold text-slate-900">{isLoading ? "..." : summary.totalKelas}</p></div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600"><LuBookOpenText size={24} /></div>
                    </div>

                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div><p className="text-sm text-slate-500">Total Sesi</p><p className="mt-2 text-3xl font-semibold text-slate-900">{isLoading ? "..." : summary.totalSesi}</p></div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600"><LuBookOpenText size={24} /></div>
                    </div>
                </div>
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <div className="mb-4 flex items-center justify-between">
                        <div><h2 className="text-lg font-semibold text-slate-900">Jadwal Terbaru</h2><p className="text-sm text-slate-500">Data diambil langsung dari database.</p></div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Live</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-160 text-left text-sm">
                            <thead><tr className="border-b border-slate-200 text-slate-500"><th className="p-3 font-medium">Hari</th><th className="p-3 font-medium">Kelas</th><th className="p-3 font-medium">Mapel</th><th className="p-3 font-medium">Tentor</th></tr></thead>
                            <tbody>{schedules.length === 0 ? <tr><td colSpan={4} className="p-6 text-center text-slate-400">Belum ada jadwal.</td></tr> : schedules.map((schedule) => <tr key={schedule.id} className="border-b border-slate-100 last:border-0"><td className="p-3 capitalize text-slate-600">{schedule.day}</td><td className="p-3 font-medium text-slate-800">{schedule.classRoom?.name ?? schedule.class_room?.name ?? "-"}</td><td className="p-3 text-slate-600">{schedule.subject?.name ?? "-"}</td><td className="p-3 text-slate-600">{schedule.teacher?.user?.name ?? "-"}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}