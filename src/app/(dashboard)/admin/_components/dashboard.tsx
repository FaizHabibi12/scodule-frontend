"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/src/lib/api-client";
import { LuBookOpenText, LuGraduationCap, LuUsers } from "react-icons/lu";
import { toast } from "sonner";
import { MdCheckCircleOutline, MdEdit } from "react-icons/md";
import { ConfirmButton } from "@/utils/confirm-dialog";

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
    subject_id: number;
    classRoom?: { name: string };
    class_room?: { name: string };
    subject?: { name: string };
    teacher?: { user?: { name: string } };
    teacher_id: number;
    status?: string;
    reject_reason?: string | null;
};

type TeacherOption = { id: number; user?: { name: string } };

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
    const [reviewSchedule, setReviewSchedule] = useState<DashboardSchedule | null>(null);
    const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>([]);
    const [replacementTeacherId, setReplacementTeacherId] = useState(0);
    const [teacherSearch, setTeacherSearch] = useState("");
    const [debouncedTeacherSearch, setDebouncedTeacherSearch] = useState("");
    const [isReviewing, setIsReviewing] = useState(false);

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

    const confirmRejection = async () => {
        if (!reviewSchedule) return;

        setIsReviewing(true);
        const { error } = await apiRequest(`/admin/schedules/${reviewSchedule.id}/confirm-rejection`, { method: "PATCH" });
        setIsReviewing(false);
        if (error) {
            toast.error("Gagal mengonfirmasi penolakan", { description: error });
            return;
        }

        toast.success("Penolakan guru berhasil dikonfirmasi");
        setReviewSchedule(null);
        await fetchSummary();
    };

    const reassignTeacher = async () => {
        if (!reviewSchedule || !replacementTeacherId) return;

        setIsReviewing(true);
        const { error } = await apiRequest(`/admin/schedules/${reviewSchedule.id}/reassign`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teacher_id: replacementTeacherId }),
        });
        setIsReviewing(false);
        if (error) {
            toast.error("Gagal mengganti guru", { description: error });
            return;
        }

        toast.success("Guru jadwal berhasil diganti");
        setReviewSchedule(null);
        await fetchSummary();
    };

    const openReview = async (schedule: DashboardSchedule) => {
        setReviewSchedule(schedule);
        setReplacementTeacherId(0);
        setTeacherSearch("");
        setDebouncedTeacherSearch("");
        const { data, error } = await apiRequest<{ data?: { data?: TeacherOption[] } | TeacherOption[] }>(
            `/admin/teachers?subject_id=${schedule.subject_id}&per_page=500`
        );
        if (error) {
            toast.error("Gagal memuat daftar guru", { description: error });
            return;
        }

        const teachers = Array.isArray(data?.data) ? data.data : data?.data?.data ?? [];
        setTeacherOptions(teachers.filter((teacher) => teacher.id !== schedule.teacher_id));
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedTeacherSearch(teacherSearch.trim().toLowerCase());
        }, 300);

        return () => window.clearTimeout(timer);
    }, [teacherSearch]);

    const filteredTeacherOptions = teacherOptions.filter((teacher) =>
        (teacher.user?.name ?? "").toLowerCase().includes(debouncedTeacherSearch)
    );

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
                            <thead><tr className="border-b border-slate-200 text-slate-500"><th className="p-3 font-medium">Hari</th><th className="p-3 font-medium">Kelas</th><th className="p-3 font-medium">Mapel</th><th className="p-3 font-medium">Tentor</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Aksi</th></tr></thead>
                            <tbody>{schedules.length === 0 ? <tr><td colSpan={6} className="p-6 text-center text-slate-400">Belum ada jadwal.</td></tr> : schedules.map((schedule) => <tr key={schedule.id} className="border-b border-slate-100 last:border-0 align-top"><td className="p-3 capitalize text-slate-600">{schedule.day}</td><td className="p-3 font-medium text-slate-800">{schedule.classRoom?.name ?? schedule.class_room?.name ?? "-"}</td><td className="p-3 text-slate-600">{schedule.subject?.name ?? "-"}</td><td className="p-3 text-slate-600">{schedule.teacher?.user?.name ?? "-"}</td><td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${schedule.status === "rejected" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{schedule.status === "rejected" ? "Guru Reject" : "Aktif"}</span>{schedule.reject_reason && <p className="mt-2 max-w-48 text-xs text-red-600">{schedule.reject_reason}</p>}</td><td className="p-3">{schedule.status === "rejected" && <button type="button" onClick={() => openReview(schedule)} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"><MdEdit />Kelola</button>}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            {reviewSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-slate-900">Guru menolak jadwal</h2>
                        <p className="mt-2 text-sm text-slate-500">{reviewSchedule.reject_reason ?? "Guru menolak pelajaran ini."}</p>
                        <div className="mt-5 space-y-3">
                            <ConfirmButton
                                onConfirm={confirmRejection}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                                title="Konfirmasi penolakan guru?"
                                description="Jadwal akan tetap ditandai sebagai ditolak sampai admin mengganti gurunya."
                                confirmText="Ya, konfirmasi"
                            >
                                <MdCheckCircleOutline />Konfirmasi penolakan
                            </ConfirmButton>
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <label className="text-sm font-medium text-slate-700">Ganti guru</label>
                                <input
                                    type="search"
                                    value={teacherSearch}
                                    onChange={(event) => setTeacherSearch(event.target.value)}
                                    placeholder="Cari nama guru pengganti..."
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                                />
                                <select value={replacementTeacherId} onChange={(event) => setReplacementTeacherId(Number(event.target.value))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary">
                                    <option value={0}>Pilih guru pengganti</option>
                                    {filteredTeacherOptions.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.user?.name ?? "Guru"}</option>)}
                                </select>
                                {filteredTeacherOptions.length === 0 && <p className="mt-2 text-xs text-slate-500">Guru dengan mapel tersebut tidak ditemukan.</p>}
                                <button type="button" onClick={reassignTeacher} disabled={!replacementTeacherId || isReviewing} className="mt-3 w-full rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-50">Simpan guru pengganti</button>
                            </div>
                        </div>
                        <button type="button" onClick={() => setReviewSchedule(null)} className="mt-4 w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200">Tutup</button>
                    </div>
                </div>
            )}
        </section>
    );
}