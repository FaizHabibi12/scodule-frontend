"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/src/lib/api-client";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export type ScheduleFormData = {
    class_room_id: number;
    subject_id: number;
    teacher_id: number;
    sub_subject_id?: number | null;
    session_id: number;
    day: string;
};

export type ClassRoom = {
    id: number;
    name: string;
};

export type Subject = {
    id: number;
    name: string;
};

export type Teacher = {
    id: number;
    user?: {
        name: string;
        id: number;
    };
    subject_id: number;
};

export type SubSubject = {
    id: number;
    name: string;
    subject_id: number;
};

export type Session = {
    id: number;
    start_time: string;
    end_time: string;
};

type ApiListResponse<T> = {
    data?: T[] | { data?: T[] };
};

interface DialogCreateScheduleProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    scheduleType: "regular" | "private";
}

export default function DialogCreateSchedule({
    open,
    onClose,
    onSuccess,
    scheduleType,
}: DialogCreateScheduleProps) {
    const [formData, setFormData] = useState<ScheduleFormData>({
        class_room_id: 0,
        subject_id: 0,
        teacher_id: 0,
        sub_subject_id: null,
        session_id: 0,
        day: "",
    });

    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [subSubjects, setSubSubjects] = useState<SubSubject[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            fetchInitialData();
        }
    }, [open]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [classRoomsRes, subjectsRes, sessionsRes] = await Promise.all([
                apiRequest<ApiListResponse<ClassRoom>>("/admin/class-rooms"),
                apiRequest<ApiListResponse<Subject>>("/subjects"),
                apiRequest<ApiListResponse<Session>>("/sessions"),
            ]);

            if (!classRoomsRes.error && classRoomsRes.data?.data) {
                setClassRooms(
                    Array.isArray(classRoomsRes.data.data)
                        ? classRoomsRes.data.data
                        : classRoomsRes.data.data.data || []
                );
            }

            if (!subjectsRes.error && subjectsRes.data?.data) {
                setSubjects(
                    Array.isArray(subjectsRes.data.data)
                        ? subjectsRes.data.data
                        : subjectsRes.data.data.data || []
                );
            }

            if (!sessionsRes.error && sessionsRes.data?.data) {
                setSessions(
                    Array.isArray(sessionsRes.data.data)
                        ? sessionsRes.data.data
                        : sessionsRes.data.data.data || []
                );
            }
        } catch {
            toast.error("Gagal memuat data awal");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeachersBySubject = async (subjectId: number) => {
        try {
            const { data, error } = await apiRequest<ApiListResponse<Teacher>>(`/admin/teachers/subject/${subjectId}`);

            if (!error && data?.data) {
                setTeachers(Array.isArray(data.data) ? data.data : data.data.data || []);
                setFormData((prev: ScheduleFormData) => ({ ...prev, teacher_id: 0 }));
            }
        } catch {
            toast.error("Gagal memuat data guru");
        }
    };

    const fetchSubSubjectsBySubject = async (subjectId: number) => {
        try {
            const { data, error } = await apiRequest<ApiListResponse<SubSubject>>(`/subjects/${subjectId}/sub-subjects`);

            if (!error && data?.data) {
                setSubSubjects(Array.isArray(data.data) ? data.data : data.data.data || []);
                setFormData((prev: ScheduleFormData) => ({ ...prev, sub_subject_id: null }));
            }
        } catch {
            toast.error("Gagal memuat sub-mapel");
        }
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subjectId = Number(e.target.value);
        setFormData((prev: ScheduleFormData) => ({ ...prev, subject_id: subjectId }));

        if (subjectId) {
            fetchTeachersBySubject(subjectId);
            fetchSubSubjectsBySubject(subjectId);
        } else {
            setTeachers([]);
            setSubSubjects([]);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: ScheduleFormData) => ({
            ...prev,
            [name]:
                name === "sub_subject_id"
                    ? value
                        ? Number(value)
                        : null
                    : name.includes("id")
                        ? Number(value)
                        : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.class_room_id ||
            !formData.subject_id ||
            !formData.teacher_id ||
            !formData.session_id ||
            !formData.day
        ) {
            toast.error("Semua field wajib diisi");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await apiRequest("/admin/schedules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (error) {
                toast.error("Gagal membuat jadwal", {
                    description: error,
                });
                return;
            }

            toast.success("Jadwal berhasil dibuat");
            setFormData({
                class_room_id: 0,
                subject_id: 0,
                teacher_id: 0,
                sub_subject_id: null,
                session_id: 0,
                day: "",
            });
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Gagal membuat jadwal", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-[#1e1e1e]">
                        Buat Jadwal Baru ({scheduleType === "private" ? "Privat" : "Biasa"})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-slate-400 transition hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-8 text-center text-slate-500">Memuat data...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Ruang Kelas
                                </label>
                                <select
                                    name="class_room_id"
                                    value={formData.class_room_id}
                                    onChange={handleInputChange}
                                    required
                                    title="Pilih ruang kelas"
                                    className="h-11 w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 text-sm outline-none focus:border-baseBlue"
                                >
                                    <option value={0}>Pilih Ruang Kelas</option>
                                    {classRooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Mapel
                                </label>
                                <select
                                    value={formData.subject_id}
                                    onChange={handleSubjectChange}
                                    required
                                    title="Pilih mapel"
                                    className="h-11 w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 text-sm outline-none focus:border-baseBlue"
                                >
                                    <option value={0}>Pilih Mapel</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Guru
                                </label>
                                <select
                                    name="teacher_id"
                                    value={formData.teacher_id}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.subject_id}
                                    title="Pilih guru"
                                    className="h-11 w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 text-sm outline-none focus:border-baseBlue disabled:bg-slate-100"
                                >
                                    <option value={0}>Pilih Guru</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.user?.name || "Guru"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Sub Mapel (Opsional)
                                </label>
                                <select
                                    name="sub_subject_id"
                                    value={formData.sub_subject_id || ""}
                                    onChange={handleInputChange}
                                    disabled={!formData.subject_id}
                                    title="Pilih sub mapel"
                                    className="h-11 w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 text-sm outline-none focus:border-baseBlue disabled:bg-slate-100"
                                >
                                    <option value="">Pilih Sub Mapel</option>
                                    {subSubjects.map((subSubject) => (
                                        <option key={subSubject.id} value={subSubject.id}>
                                            {subSubject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Sesi
                                </label>
                                <select
                                    name="session_id"
                                    value={formData.session_id}
                                    onChange={handleInputChange}
                                    required
                                    title="Pilih sesi"
                                    className="h-11 w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 text-sm outline-none focus:border-baseBlue"
                                >
                                    <option value={0}>Pilih Sesi</option>
                                    {sessions.map((session) => (
                                        <option key={session.id} value={session.id}>
                                            {session.start_time} - {session.end_time}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Hari
                                </label>
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    required
                                    title="Pilih hari"
                                    className="h-11 w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 text-sm outline-none focus:border-baseBlue"
                                >
                                    <option value="">Pilih Hari</option>
                                    {DAYS.map((day) => (
                                        <option key={day} value={day.toLowerCase()}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-2xl border border-[#d9d9d9] px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 rounded-2xl bg-baseBlue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? "Membuat..." : "Buat Jadwal"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
