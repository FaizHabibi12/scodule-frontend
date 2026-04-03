"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/src/lib/api-client";
import { LuBookOpenText, LuGraduationCap, LuUsers } from "react-icons/lu";
import { toast } from "sonner";

type DashboardSummary = {
    totalTeacher: number;
    totalStudent: number;
    totalPelajaran: number;
};

type PaginatedResponse<T> = {
    data?: {
        data?: T[];
    };
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
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchSummary = useCallback(async () => {
        setIsLoading(true);

        const [teacherRes, studentRes, subjectRes] = await Promise.all([
            apiRequest<PaginatedResponse<unknown>>("/admin/teachers?per_page=500"),
            apiRequest<PaginatedResponse<unknown>>("/admin/students?per_page=500"),
            apiRequest<SubjectResponse>("/subjects"),
        ]);

        if (teacherRes.error || studentRes.error || subjectRes.error) {
            toast.error("Gagal memuat ringkasan dashboard", {
                description: teacherRes.error || studentRes.error || subjectRes.error || "Terjadi kesalahan saat mengambil data.",
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
        });
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const loadSummary = async () => {
            await fetchSummary();
        };

        void loadSummary();
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
                </div>
            </div>
        </section>
    );
}