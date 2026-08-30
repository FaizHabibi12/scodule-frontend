"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CiSearch } from "react-icons/ci";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { LuDownload, LuUpload } from "react-icons/lu";
import { DEFAULT_PAGE } from "@/src/constants/data-table-constant";
import { IMPORT_ACCEPTED_FILE_TYPES } from "@/src/constants/user-management-constant";
import { apiRequest, API_CONFIG } from "@/src/lib/api-client";
import { TeacherListResponse, TeacherTableRecord } from "@/src/types/user-management";
import DialogDeleteTentor from "./dialog-delete-tentor";
import DialogUpdateTentor from "./dialog-update-tentor";
import { IoIosArrowDown } from "react-icons/io";

const ITEMS_PER_PAGE = 6;
const EDGE_VISIBLE_PAGES = 4;
const SKILL_OPTIONS = ["Semua Keahlian", "Matematika", "Fisika", "Biologi", "Kimia", "Bahasa Inggris", "Informatika"];
type PaginationItem = number | "ellipsis";

export default function DaftarTentorManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSkill, setSelectedSkill] = useState(SKILL_OPTIONS[0]);
    const [isSkillSelectOpen, setIsSkillSelectOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [mentors, setMentors] = useState<TeacherTableRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<TeacherTableRecord | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchTeachers = useCallback(async () => {
        setIsLoading(true);

        const { data, error } = await apiRequest<TeacherListResponse>("/admin/teachers?per_page=500");

        if (error) {
            toast.error("Gagal memuat data tentor", {
                description: error,
            });
            setMentors([]);
            setIsLoading(false);
            return;
        }

        const apiUsers = data?.data?.data ?? [];
        const mappedMentors = apiUsers.map((user) => ({
            id: user.id,
            userId: user.user?.id ?? 0,
            kodeUser: user.user?.kode_user ?? "",
            role: user.user?.role ?? "teacher",
            fullName: user.user?.name ?? "-",
            phoneNumber: user.user?.phone_number ?? user.phone_number ?? user.teacher?.phone_number ?? "-",
            expertise: user.subject?.name ?? user.teacher?.subject?.name ?? "-",
        }));

        setMentors(mappedMentors);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const filteredMentors = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return mentors.filter((mentor) => {
            const matchKeyword =
                !query ||
                mentor.fullName.toLowerCase().includes(query) ||
                mentor.phoneNumber.toLowerCase().includes(query) ||
                mentor.expertise.toLowerCase().includes(query);

            const matchSkill = selectedSkill === SKILL_OPTIONS[0] || mentor.expertise === selectedSkill;

            return matchKeyword && matchSkill;
        });
    }, [searchQuery, selectedSkill, mentors]);

    const totalPages = Math.max(1, Math.ceil(filteredMentors.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMentors = filteredMentors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const pages = useMemo<PaginationItem[]>(() => {
        if (totalPages <= EDGE_VISIBLE_PAGES + 1) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= EDGE_VISIBLE_PAGES) {
            return [
                ...Array.from({ length: EDGE_VISIBLE_PAGES }, (_, index) => index + 1),
                "ellipsis",
                totalPages,
            ];
        }

        if (currentPage >= totalPages - (EDGE_VISIBLE_PAGES - 1)) {
            return [
                1,
                "ellipsis",
                ...Array.from({ length: EDGE_VISIBLE_PAGES }, (_, index) => totalPages - EDGE_VISIBLE_PAGES + index + 1),
            ];
        }

        return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
    }, [currentPage, totalPages]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleSkillChange = (value: string) => {
        setSelectedSkill(value);
        setCurrentPage(1);
        setIsSkillSelectOpen(false);
    };

    const handleImportClick = () => {
        if (isImporting) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setIsImporting(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_CONFIG.baseURL}/admin/import/teachers`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.error || result?.message || "Import gagal");
            }

            const createdRows = result?.created_rows ?? 0;
            const skippedRows = result?.skipped_rows ?? 0;
            toast.success("Import tentor selesai", {
                description: `${createdRows} data baru, ${skippedRows} data dilewati.`,
            });
            await fetchTeachers();
        } catch (error) {
            toast.error("Import tentor gagal", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat import.",
            });
        } finally {
            event.target.value = "";
            setIsImporting(false);
        }
    };

    const handleUpdateClick = (mentor: TeacherTableRecord) => {
        setSelectedMentor(mentor);
        setOpenUpdateDialog(true);
    };

    const handleDeleteClick = (mentor: TeacherTableRecord) => {
        setSelectedMentor(mentor);
        setOpenDeleteDialog(true);
    };

    return (
        <section className="min-h-[calc(100vh-7rem)] bg-[#eef0f0] px-12 mt-6 pb-8">
            <input
                ref={fileInputRef}
                type="file"
                title="Import file tentor"
                accept={IMPORT_ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={handleImportChange}
            />
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-2xl font-medium text-black">Daftar Tentor</h5>
                </div>

                <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full max-w-95">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Search Bar"
                            className="h-12 w-full rounded-2xl bg-white px-5 pr-12 text-base text-slate-700 outline-none placeholder:text-slate-400"
                        />
                        <CiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400" />
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <div className="group relative">
                            <select
                                title="Pilih keahlian"
                                value={selectedSkill}
                                onChange={(event) => handleSkillChange(event.target.value)}
                                onPointerDown={() => setIsSkillSelectOpen(true)}
                                onBlur={() => setIsSkillSelectOpen(false)}
                                className="h-11 min-w-32 appearance-none rounded-2xl bg-white px-4 pr-9 text-sm text-slate-400 outline-none">
                                {SKILL_OPTIONS.map((skill) => (
                                    <option key={skill} value={skill}>
                                        {skill}
                                    </option>
                                ))}
                            </select>
                            <IoIosArrowDown className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 ease-out group-hover:scale-110 ${isSkillSelectOpen ? "rotate-180" : "rotate-0"}`} />
                        </div>

                        <button
                            type="button"
                            onClick={handleImportClick}
                            disabled={isImporting}
                            className="flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm text-slate-400 transition hover:text-slate-600">
                            Import
                            <LuUpload className="text-base" />
                        </button>
                        <button
                            type="button"
                            onClick={() => toast.info("Export belum tersedia", { description: "Endpoint export belum tersedia di backend." })}
                            className="flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm text-slate-400 transition hover:text-slate-600">
                            Export
                            <LuDownload className="text-base" />
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-2 shadow-[0_12px_40px_rgba(37,52,63,0.08)]">
                    <div className="overflow-hidden rounded-[18px] border border-[#d9d9d9]">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-baseBlue text-white">
                                    <th className="w-16 border-r-4 border-white px-3 py-4 text-left text-sm font-medium">NO</th>
                                    <th className="border-r-4 border-white px-3 py-4 text-left text-sm font-medium">Nama Lengkap</th>
                                    <th className="border-r-4 border-white px-3 py-4 text-left text-sm font-medium">Nomor Telepon</th>
                                    <th className="border-r-4 border-white px-3 py-4 text-left text-sm font-medium">Keahlian</th>
                                    <th className="w-32 px-3 py-4 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                                            Memuat data tentor...
                                        </td>
                                    </tr>
                                ) : currentMentors.length > 0 ? (
                                    currentMentors.map((mentor, index) => (
                                        <tr key={mentor.id} className={index % 2 === 0 ? "bg-white" : "bg-[#25343F14]"}>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-center" : "text-center border-r-4 border-white"}>
                                                {String(startIndex + index + 1).padStart(2, "0")}
                                            </td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : "px-3 py-4 text-left border-r-4 border-white"}>{mentor.fullName}</td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : "px-3 py-4 text-left border-r-4 border-white"}>{mentor.phoneNumber}</td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : "px-3 py-4 text-left border-r-4 border-white"}>{mentor.expertise}</td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateClick(mentor)}
                                                        className="rounded-full bg-[#28c98b] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#20b178]">
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(mentor)}
                                                        className="rounded-full bg-[#f05b4f] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#db473d]">
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                                            Tidak ada tentor yang cocok dengan filter saat ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex items-center justify-between px-2">
                        <button
                            type="button"
                            title="Halaman sebelumnya"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-baseBlue text-white transition disabled:cursor-not-allowed disabled:opacity-40">
                            <IoChevronBackOutline className="text-xl" />
                        </button>

                        <div className="flex items-center gap-5 text-sm text-slate-400">
                            {pages.map((page, index) => {
                                if (page === "ellipsis") {
                                    return (
                                        <span key={`ellipsis-${index}`} className="text-slate-400">
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => handlePageChange(page)}
                                        className={`flex h-8 w-8 items-center justify-center rounded-full transition ${currentPage === page
                                            ? "border border-baseBlue text-baseBlue"
                                            : "text-slate-400 hover:text-slate-600"
                                            }`}>
                                        {String(page).padStart(2, "0")}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            title="Halaman berikutnya"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-baseBlue text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <IoChevronForwardOutline className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            <DialogUpdateTentor
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                currentData={selectedMentor}
                onSuccess={fetchTeachers}
            />

            <DialogDeleteTentor
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                currentData={selectedMentor}
                onSuccess={fetchTeachers}
            />
        </section>
    );
}
