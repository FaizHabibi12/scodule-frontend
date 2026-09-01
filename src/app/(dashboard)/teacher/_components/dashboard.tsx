"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/src/lib/api-client";
import { LuBookOpenText, LuCalendarCheck2, LuGraduationCap } from "react-icons/lu";
import { toast } from "sonner";

type TeacherDashboardSchedule = {
    id: number;
    day: string;
    status?: string;
    reject_reason?: string | null;
    schedule_date?: string | null;
    week_number?: number | null;
    month?: number | null;
    year?: number | null;
    classRoom?: { name: string };
    class_room?: { name: string };
    subject?: { name: string };
    subSubject?: { name: string };
    subSubjects?: Array<{ name?: string }>;
    session?: { start_time?: string; end_time?: string; name?: string };
};

type TeacherDashboardResponse = {
    teacher?: { user?: { name?: string; kode_user?: string } };
    subject?: { name?: string };
    today?: string;
    total_schedules?: number;
    total_classes?: number;
    today_schedules?: TeacherDashboardSchedule[];
    all_schedules?: TeacherDashboardSchedule[];
};

export default function DashboardPage() {
    const [teacher, setTeacher] = useState<any>(null);
    const [schedules, setSchedules] = useState<TeacherDashboardSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rejectingSchedule, setRejectingSchedule] = useState<TeacherDashboardSchedule | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const fetchTeacherDashboard = useCallback(async () => {
        setIsLoading(true);

        const { data, error } = await apiRequest<TeacherDashboardResponse>("/teacher/dashboard");

        if (error) {
            toast.error("Gagal memuat dashboard guru", { description: error });
            setIsLoading(false);
            return;
        }

        setTeacher(data?.teacher ?? null);
        const normalizedSchedules = (data?.all_schedules ?? []).map((item) => ({
            ...item,
            classRoom: item.classRoom ?? item.class_room ?? { name: "-" },
        }));

        setSchedules(normalizedSchedules);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTeacherDashboard();
    }, [fetchTeacherDashboard]);

    const summary = useMemo(() => ({
        totalPelajaran: schedules.length,
        totalKelas: new Set(schedules.map((item) => item.classRoom?.name ?? item.class_room?.name)).size,
        hariIni: teacher?.user?.name ? "Hari ini" : "-",
    }), [schedules, teacher]);

    const handleRejectSchedule = async () => {
        if (!rejectingSchedule) return;

        setIsRejecting(true);
        const { error } = await apiRequest(`/teacher/schedules/${rejectingSchedule.id}/reject`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reject_reason: rejectReason.trim() || "Jadwal ditolak oleh guru." }),
        });

        if (error) {
            toast.error("Gagal menolak jadwal", { description: error });
            setIsRejecting(false);
            return;
        }

        toast.success("Jadwal berhasil ditolak");
        setRejectingSchedule(null);
        setRejectReason("");
        setIsRejecting(false);
        await fetchTeacherDashboard();
    };

    return (
        <section className="w-full px-12">
            <div className="mt-6 flex w-full flex-col gap-4">
                <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Selamat datang</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                                {teacher?.user?.name ?? "Guru"}
                            </h2>
                        </div>
                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            {teacher?.user?.kode_user ? `Kode: ${teacher.user.kode_user}` : "Teacher"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div>
                            <p className="text-sm text-slate-500">Mapel diajarkan</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">
                                {isLoading ? "..." : (teacher && (teacher.subject?.name || "Belum ditentukan"))}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <LuGraduationCap size={24} />
                        </div>
                    </div>

                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div>
                            <p className="text-sm text-slate-500">Total Kelas</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">
                                {isLoading ? "..." : summary.totalKelas}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <LuBookOpenText size={24} />
                        </div>
                    </div>

                    <div className="flex min-h-30 min-w-65 flex-1 items-center justify-between rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <div>
                            <p className="text-sm text-slate-500">Jadwal Hari Ini</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">
                                {isLoading ? "..." : schedules.filter((item) => item.day === new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()).length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <LuCalendarCheck2 size={24} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Jadwal saya</h2>
                            <p className="text-sm text-slate-500">List jadwal yang sudah dibuat oleh admin dan aktif.</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-160 text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="p-3 font-medium">Hari</th>
                                    <th className="p-3 font-medium">Kelas</th>
                                    <th className="p-3 font-medium">Mapel</th>
                                    <th className="p-3 font-medium">Sesi</th>
                                    <th className="p-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.length === 0 ? (
                                    <tr><td colSpan={5} className="p-6 text-center text-slate-400">Belum ada jadwal untuk guru ini.</td></tr>
                                ) : schedules.map((schedule) => (
                                    <tr key={schedule.id} className="border-b border-slate-100 last:border-0 align-top">
                                        <td className="p-3 capitalize text-slate-600">
                                            <div>{schedule.day}</div>
                                            <div className="text-[11px] text-slate-400">
                                                {schedule.schedule_date ? new Date(schedule.schedule_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium text-slate-800">{schedule.classRoom?.name ?? schedule.class_room?.name ?? "-"}</td>
                                        <td className="p-3 text-slate-600">
                                            <div>{schedule.subject?.name ?? "-"}</div>
                                            {schedule.subSubjects && schedule.subSubjects.length > 0 && (
                                                <div className="mt-1 text-[11px] text-slate-500">
                                                    {schedule.subSubjects.map((item) => item.name).filter(Boolean).join(", ")}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-slate-600">
                                            <div>{schedule.session ? `${schedule.session.start_time ?? ""} - ${schedule.session.end_time ?? ""}` : "-"}</div>
                                            <div className="text-[11px] text-slate-400">Week {schedule.week_number ?? 1}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col gap-2">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${schedule.status === "rejected" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                    {schedule.status === "rejected" ? "Ditolak" : "Aktif"}
                                                </span>
                                                {schedule.status !== "rejected" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setRejectingSchedule(schedule);
                                                            setRejectReason("");
                                                        }}
                                                        className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 transition hover:bg-red-100"
                                                    >
                                                        Tolak
                                                    </button>
                                                )}
                                                {schedule.reject_reason && (
                                                    <span className="text-[11px] text-red-600">{schedule.reject_reason}</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {rejectingSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-slate-900">Tolak jadwal pelajaran?</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Jelaskan alasan agar admin dapat segera menindaklanjuti jadwal ini.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(event) => setRejectReason(event.target.value)}
                            placeholder="Contoh: Saya berhalangan pada tanggal tersebut."
                            rows={4}
                            className="mt-4 w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-primary"
                        />
                        <div className="mt-5 flex justify-end gap-3">
                            <button type="button" onClick={() => setRejectingSchedule(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleRejectSchedule}
                                disabled={isRejecting}
                                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isRejecting ? "Mengirim..." : "Konfirmasi Tolak"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}