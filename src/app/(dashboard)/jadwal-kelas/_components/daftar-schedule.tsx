"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MdDeleteOutline, MdEdit, MdDownload } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import DialogSelectScheduleType from "./dialog-select-schedule-type";
import DialogCreateSchedule, { type ScheduleFormData } from "./dialog-create-schedule";
import { apiRequest } from "@/src/lib/api-client";
import { ConfirmButton } from "@/utils/confirm-dialog";

type ScheduleApiRecord = {
    id: number;
    day: string;
    class_room_id: number;
    subject_id: number;
    teacher_id: number;
    sub_subject_id?: number;
    sub_subject_ids?: number[];
    schedule_date?: string | null;
    week_number?: number | null;
    month?: number | null;
    year?: number | null;
    status?: string | null;
    reject_reason?: string | null;
    session_id: number;
    classRoom?: {
        name: string;
    };
    teacher?: {
        user?: {
            name: string;
        };
    };
    subject?: {
        name: string;
    };
    subSubject?: {
        name: string;
    };
    subSubjects?: Array<{ name?: string }>;
    session?: {
        start_time: string;
        end_time: string;
        id: number;
    };
};

type ScheduleGrid = {
    [sessionId: number]: {
        [day: string]: ScheduleApiRecord | null;
    };
};

type ClassRoom = { id: number; name: string };

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAYS_DISPLAY: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
};

const WEEKS = [1, 2, 3, 4];

const normalizeScheduleForForm = (schedule: ScheduleApiRecord): ScheduleFormData & { id: number } => ({
    id: schedule.id,
    class_room_id: schedule.class_room_id,
    subject_id: schedule.subject_id,
    teacher_id: schedule.teacher_id,
    sub_subject_id: schedule.sub_subject_id ?? null,
    sub_subject_ids: schedule.sub_subject_ids ?? (schedule.sub_subject_id ? [schedule.sub_subject_id] : []),
    session_id: schedule.session_id,
    day: schedule.day,
    schedule_date: schedule.schedule_date ?? undefined,
    week_number: schedule.week_number ?? 1,
    status: schedule.status ?? 'active',
    reject_reason: schedule.reject_reason ?? null,
});

export default function DaftarSchedule() {
    const [currentWeek, setCurrentWeek] = useState(1);
    const [schedules, setSchedules] = useState<ScheduleApiRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const isAdmin = role === "admin";
    const isTeacher = role === "teacher";
    const [openSelectType, setOpenSelectType] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditWeekDialog, setOpenEditWeekDialog] = useState(false);
    const [editWeek, setEditWeek] = useState(1);
    const [editClassId, setEditClassId] = useState(0);
    const [editingSchedule, setEditingSchedule] = useState<(ScheduleFormData & { id: number }) | undefined>();
    const [selectedScheduleType, setSelectedScheduleType] = useState<"regular" | "private">(
        "regular"
    );
    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);

    const fetchSchedules = useCallback(async () => {
        if (!role) return;

        setIsLoading(true);

        const endpoint = isTeacher
            ? '/teacher/schedules'
            : selectedClassId
                ? `/admin/schedules?class_room_id=${selectedClassId}`
                : '/admin/schedules';
        const { data, error } = await apiRequest<ScheduleApiRecord[]>(endpoint);
        if (error) {
            toast.error('Gagal memuat jadwal', { description: error });
            setSchedules([]);
        } else {
            const loadedSchedules = Array.isArray(data) ? data : [];
            setSchedules(loadedSchedules);

            if (isTeacher) {
                const today = new Date().toISOString().slice(0, 10);
                const hasTeachingToday = loadedSchedules.some(
                    (schedule) => schedule.schedule_date?.slice(0, 10) === today
                );

                if (!hasTeachingToday) {
                    toast.info('Tidak jadwal pelajaran hari ini', { description: 'Anda tidak memiliki jadwal mengajar untuk hari ini.' });
                }
            }
        }
        setIsLoading(false);
    }, [isTeacher, role, selectedClassId]);

    useEffect(() => {
        const roleCookie = document.cookie
            .split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("user_role="))
            ?.split("=")[1];

        setRole(roleCookie ? decodeURIComponent(roleCookie) : "");
    }, []);

    useEffect(() => {
        if (!isAdmin) return;

        apiRequest<{ data?: ClassRoom[] }>('/admin/classes').then(({ data }) => {
            const rooms = Array.isArray(data) ? data : data?.data ?? [];
            setClassRooms(rooms);
            if (rooms.length > 0) setSelectedClassId(rooms[0].id);
        });
    }, [isAdmin]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const filteredSchedules = schedules.filter(
        (schedule) => Number(schedule.week_number) === currentWeek
    );

    const scheduleGrid: ScheduleGrid = filteredSchedules.reduce((acc, schedule) => {
        const sessionId = schedule.session_id;
        if (!acc[sessionId]) {
            acc[sessionId] = {};
        }
        acc[sessionId][schedule.day] = schedule;
        return acc;
    }, {} as ScheduleGrid);

    // Get sorted sessions
    const sessions = Object.keys(scheduleGrid)
        .map((id) => parseInt(id))
        .sort((a, b) => a - b);

    const handleCreateClick = () => {
        if (!isAdmin) {
            return;
        }

        setOpenSelectType(true);
    };

    const handleTypeSelect = (type: "regular" | "private") => {
        if (!isAdmin) {
            return;
        }

        setSelectedScheduleType(type);
        setOpenSelectType(false);
        setOpenCreateDialog(true);
    };

    const handleExport = () => {
        if (!isAdmin) {
            return;
        }

        toast.info("Export belum tersedia", { description: "Endpoint export belum tersedia di backend." });
    };

    const handleDelete = async (schedule: ScheduleApiRecord) => {
        const { error } = await apiRequest(`/admin/schedules/${schedule.id}`, { method: "DELETE" });
        if (error) {
            toast.error("Gagal menghapus jadwal", { description: error });
            return;
        }

        toast.success("Jadwal berhasil dihapus");
        await fetchSchedules();
    };

    return (
        <section className="min-h-[calc(100vh-7rem)] bg-[#f0f0f0] px-12 py-6">
            <div className="mx-auto w-full max-w-7xl">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <label className="mb-2 block text-sm text-slate-600">Ruang Kelas
                            {isAdmin && (
                                <select
                                    value={selectedClassId}
                                    onChange={(event) => setSelectedClassId(Number(event.target.value))}
                                    className="ml-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                                    title="Pilih ruang kelas"
                                >
                                    <option value={0}>Semua kelas</option>
                                    {classRooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                                </select>
                            )}
                        </label>
                        <h1 className="text-4xl font-bold text-slate-900">
                            Jadwal <span className="text-primary">{classRooms.find((room) => room.id === selectedClassId)?.name ?? "Kelas"}</span>
                        </h1>
                    </div>

                    {isAdmin && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleCreateClick}
                                className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary/90">
                                <FiPlus className="text-lg" />
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditWeek(currentWeek);
                                    setEditClassId(selectedClassId);
                                    setOpenEditWeekDialog(true);
                                }}
                                className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary/90">
                                <MdEdit className="text-lg" />
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary/90">
                                <MdDownload className="text-lg" />
                                Export
                            </button>
                        </div>
                    )}
                </div>

                {/* Schedule Table Card */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">

                    <div className="w-full">
                        <div className="mb-6 flex gap-3">
                            {WEEKS.map((week) => (
                                <button
                                    key={week}
                                    onClick={() => setCurrentWeek(week)}
                                    className={`rounded-xl w-full py-4 font-normal text-lg transition ${currentWeek === week
                                        ? "bg-primary text-white"
                                        : "bg-primary/10 text-primary"
                                        }`}>
                                    Week {week}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Week {currentWeek}
                        </div>
                        <div className="text-sm text-slate-500">
                            {filteredSchedules.length} jadwal ditampilkan
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-12 text-center text-slate-500">Memuat jadwal...</div>
                    ) : sessions.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            {isTeacher ? 'Tidak ada jadwal mengajar.' : 'Tidak ada jadwal untuk kelas ini.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-white">
                                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-medium">
                                            Session
                                        </th>
                                        {DAYS.map((day) => (
                                            <th
                                                key={day}
                                                className="border border-slate-300 px-4 py-3 text-center text-sm font-medium">
                                                {DAYS_DISPLAY[day]}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((sessionId) => {
                                        const sessionSchedules = filteredSchedules.find(
                                            (s) => s.session_id === sessionId
                                        );
                                        const sessionLabel = sessionSchedules?.session
                                            ? `${sessionSchedules.session.start_time} - ${sessionSchedules.session.end_time}`
                                            : `Sesi ${sessionId}`;

                                        return (
                                            <tr key={sessionId}>
                                                <td className="border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                                    <div>Sesi {sessionId}</div>
                                                    <div className="text-xs text-slate-500">{sessionLabel}</div>
                                                </td>
                                                {DAYS.map((day) => {
                                                    const schedule = scheduleGrid[sessionId]?.[day];
                                                    return (
                                                        <td
                                                            key={`${sessionId}-${day}`}
                                                            className="border border-slate-300 p-3 text-center">
                                                            {schedule ? (
                                                                <div className="rounded-lg bg-blue-100 p-3 text-left">
                                                                    <div className="w-full text-left">
                                                                        <div className="font-medium text-blue-900">
                                                                            {schedule.subject?.name}
                                                                        </div>
                                                                        {schedule.subject && (
                                                                            <div className="text-xs text-blue-700">
                                                                                {schedule.teacher?.user?.name}
                                                                            </div>
                                                                        )}
                                                                        {schedule.schedule_date && (
                                                                            <div className="mt-1 text-[10px] text-blue-800">
                                                                                {new Date(schedule.schedule_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                                            </div>
                                                                        )}
                                                                        {schedule.status === "rejected" && (
                                                                            <div className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] text-red-700">
                                                                                <strong>Guru reject pelajaran ini.</strong>
                                                                                {schedule.reject_reason && <div>{schedule.reject_reason}</div>}
                                                                            </div>
                                                                        )}
                                                                        {(schedule.subSubjects && schedule.subSubjects.length > 0) && (
                                                                            <div className="mt-1 text-[10px] text-blue-800">
                                                                                {schedule.subSubjects.map((item) => item.name).filter(Boolean).join(", ")}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isAdmin && openEditWeekDialog && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">Kelola jadwal</p>
                                <h2 className="text-2xl font-bold text-slate-900">Pilih Week</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpenEditWeekDialog(false)}
                                className="text-2xl text-slate-400 transition hover:text-slate-700"
                                aria-label="Tutup"
                            >
                                x
                            </button>
                        </div>

                        <div className="mb-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                            <label className="text-sm font-medium text-slate-600">
                                Kelas
                                <select
                                    value={editClassId}
                                    onChange={(event) => {
                                        const classId = Number(event.target.value);
                                        setEditClassId(classId);
                                        setSelectedClassId(classId);
                                    }}
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-primary"
                                    title="Pilih kelas untuk dikelola"
                                >
                                    <option value={0}>Semua kelas</option>
                                    {classRooms.map((room) => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="grid grid-cols-4 gap-2 sm:min-w-84">
                                {WEEKS.map((week) => (
                                    <button
                                        key={week}
                                        type="button"
                                        onClick={() => setEditWeek(week)}
                                        className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${editWeek === week
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "bg-primary/10 text-primary hover:bg-primary/20"
                                            }`}
                                    >
                                        Week {week}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-h-[50vh] space-y-3 overflow-y-auto">
                            {schedules.filter((schedule) =>
                                Number(schedule.week_number) === editWeek &&
                                (!editClassId || schedule.class_room_id === editClassId)
                            ).length === 0 ? (
                                <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    Tidak ada jadwal pada Week {editWeek}.
                                </p>
                            ) : (
                                schedules
                                    .filter((schedule) =>
                                        Number(schedule.week_number) === editWeek &&
                                        (!editClassId || schedule.class_room_id === editClassId)
                                    )
                                    .map((schedule) => (
                                        <div key={schedule.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{schedule.subject?.name ?? "Mata pelajaran"}</p>
                                                <p className="text-sm text-slate-500">
                                                    {schedule.classRoom?.name ?? "Kelas"} · {schedule.day} · {schedule.session?.start_time ?? "-"}
                                                </p>
                                                {schedule.schedule_date && (
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(schedule.schedule_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingSchedule(normalizeScheduleForForm(schedule));
                                                        setOpenEditWeekDialog(false);
                                                        setOpenCreateDialog(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                                                >
                                                    <MdEdit className="text-sm" />
                                                    Edit
                                                </button>
                                                <ConfirmButton
                                                    onConfirm={() => handleDelete(schedule)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    <MdDeleteOutline className="text-base" />
                                                    Hapus
                                                </ConfirmButton>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isAdmin && (
                <DialogSelectScheduleType
                    open={openSelectType}
                    onClose={() => setOpenSelectType(false)}
                    onSelect={handleTypeSelect}
                />
            )}

            {isAdmin && (
                <DialogCreateSchedule
                    open={openCreateDialog}
                    onClose={() => {
                        setOpenCreateDialog(false);
                        setEditingSchedule(undefined);
                    }}
                    onSuccess={fetchSchedules}
                    scheduleType={selectedScheduleType}
                    schedule={editingSchedule}
                />
            )}
        </section>
    );
}
