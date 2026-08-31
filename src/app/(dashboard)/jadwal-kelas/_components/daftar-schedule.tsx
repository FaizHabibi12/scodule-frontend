"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MdEdit, MdDownload } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import DialogSelectScheduleType from "./dialog-select-schedule-type";
import DialogCreateSchedule from "./dialog-create-schedule";
import { apiRequest } from "@/src/lib/api-client";
import { ConfirmButton } from "@/utils/confirm-dialog";

type ScheduleApiRecord = {
    id: number;
    day: string;
    class_room_id: number;
    subject_id: number;
    teacher_id: number;
    sub_subject_id?: number;
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

export default function DaftarSchedule() {
    const [currentWeek, setCurrentWeek] = useState(1);
    const [schedules, setSchedules] = useState<ScheduleApiRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openSelectType, setOpenSelectType] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<ScheduleApiRecord | undefined>();
    const [selectedScheduleType, setSelectedScheduleType] = useState<"regular" | "private">(
        "regular"
    );
    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);

    const fetchSchedules = useCallback(async () => {
        setIsLoading(true);

        const endpoint = selectedClassId
            ? `/admin/schedules?class_room_id=${selectedClassId}`
            : '/admin/schedules';
        const { data, error } = await apiRequest<ScheduleApiRecord[]>(endpoint);
        if (error) {
            toast.error('Gagal memuat jadwal', { description: error });
            setSchedules([]);
        } else {
            setSchedules(Array.isArray(data) ? data : []);
        }
        setIsLoading(false);
    }, [selectedClassId]);

    useEffect(() => {
        apiRequest<{ data?: ClassRoom[] }>('/admin/classes').then(({ data }) => {
            const rooms = Array.isArray(data) ? data : data?.data ?? [];
            setClassRooms(rooms);
            if (rooms.length > 0) setSelectedClassId(rooms[0].id);
        });
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    useEffect(() => {
        const roleCookie = document.cookie
            .split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("user_role="))
            ?.split("=")[1];

        const role = roleCookie ? decodeURIComponent(roleCookie) : "";
        setIsAdmin(role === "admin");
    }, []);

    // Group schedules by session and day
    const scheduleGrid: ScheduleGrid = schedules.reduce((acc, schedule) => {
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
        if (!window.confirm("Hapus jadwal ini?")) return;

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
                            <select
                                value={selectedClassId}
                                onChange={(event) => setSelectedClassId(Number(event.target.value))}
                                className="ml-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                                title="Pilih ruang kelas"
                            >
                                <option value={0}>Semua kelas</option>
                                {classRooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                            </select>
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
                                    const firstSchedule = schedules[0];
                                    if (firstSchedule) {
                                        setEditingSchedule(firstSchedule);
                                        setOpenCreateDialog(true);
                                    } else {
                                        toast.info('Belum ada jadwal untuk diedit');
                                    }
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
                                        : "bg-orange-100 text-primary"
                                        }`}>
                                    Week {week}
                                </button>
                            ))}
                        </div>
                    </div>


                    {isLoading ? (
                        <div className="py-12 text-center text-slate-500">Memuat jadwal...</div>
                    ) : sessions.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">Tidak ada jadwal untuk kelas ini.</div>
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
                                        const sessionSchedules = schedules.find(
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
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingSchedule(schedule);
                                                                            setOpenCreateDialog(true);
                                                                        }}
                                                                        className="w-full text-left transition hover:text-blue-700">
                                                                        <div className="font-medium text-blue-900">
                                                                            {schedule.subject?.name}
                                                                        </div>
                                                                        {schedule.subject && (
                                                                            <div className="text-xs text-blue-700">
                                                                                {schedule.teacher?.user?.name}
                                                                            </div>
                                                                        )}
                                                                    </button>
                                                                    <ConfirmButton onConfirm={() => handleDelete(schedule)}>
                                                                        Hapus
                                                                    </ConfirmButton>

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
