"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CiSearch } from "react-icons/ci";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { LuDownload, LuUpload } from "react-icons/lu";
import { DEFAULT_PAGE } from "@/src/constants/data-table-constant";
import { IMPORT_ACCEPTED_FILE_TYPES } from "@/src/constants/user-management-constant";
import { apiRequest, API_CONFIG } from "@/src/lib/api-client";
import { StudentListResponse, StudentTableRecord } from "@/src/types/user-management";
import DialogUpdatePelajar from "./dialog-update-pelajar";
import DialogDeletePelajar from "./dialog-delete-pelajar";

const ITEMS_PER_PAGE = 6;
const EDGE_VISIBLE_PAGES = 4;
type PaginationItem = number | "ellipsis";

export default function DaftarUserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [users, setUsers] = useState<StudentTableRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<StudentTableRecord | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);

        const { data, error } = await apiRequest<StudentListResponse>("/admin/students?per_page=500");

        if (error) {
            toast.error("Gagal memuat data pelajar", {
                description: error,
            });
            setUsers([]);
            setIsLoading(false);
            return;
        }

        const apiUsers = data?.data?.data ?? [];
        const mappedUsers = apiUsers.map((user) => ({
            id: user.id,
            userId: user.user?.id ?? 0,
            kodeUser: user.user?.kode_user ?? "",
            role: user.user?.role ?? "student",
            fullName: user.user?.name ?? "-",
            phoneNumber: user.user?.phone_number ?? user.phone_number ?? "-",
        }));

        setUsers(mappedUsers);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return users;
        }

        return users.filter((user) => {
            return (
                user.fullName.toLowerCase().includes(query) ||
                user.phoneNumber.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, users]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

            const response = await fetch(`${API_CONFIG.baseURL}/admin/import/students`, {
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
            toast.success("Import pelajar selesai", {
                description: `${createdRows} data baru, ${skippedRows} data dilewati.`,
            });
            await fetchStudents();
        } catch (error) {
            toast.error("Import pelajar gagal", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat import.",
            });
        } finally {
            event.target.value = "";
            setIsImporting(false);
        }
    };

    const handleUpdateClick = (user: StudentTableRecord) => {
        setSelectedUser(user);
        setOpenUpdateDialog(true);
    };

    const handleDeleteClick = (user: StudentTableRecord) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    return (
        <section className="min-h-[calc(100vh-7rem)] bg-[#eef0f0] px-12 mt-6 pb-8">
            <input
                ref={fileInputRef}
                type="file"
                title="Import file pelajar"
                accept={IMPORT_ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={handleImportChange}
            />
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-2xl font-semibold text-[#1e1e1e]">Daftar Pelajar</h5>
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

                    <div className="flex items-center gap-3 self-end lg:self-auto">
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

                <div className="rounded-3xl bg-white p-3 shadow-[0_12px_40px_rgba(37,52,63,0.08)]">
                    <div className="overflow-hidden rounded-[18px] border border-[#d9d9d9]">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-baseBlue text-white ">
                                    <th className="w-14 border-r-4 border-white px-3 py-4 text-center text-sm font-medium">NO</th>
                                    <th className="border-r-4 border-white px-3 py-4 text-left text-sm font-medium">Nama Lengkap</th>
                                    <th className="border-r-4 border-white px-3 py-4 text-left text-sm font-medium">Nomor Telepon</th>
                                    <th className="w-32 px-3 py-4 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                                            Memuat data pelajar...
                                        </td>
                                    </tr>
                                ) : currentUsers.length > 0 ? (
                                    currentUsers.map((user, index) => (
                                        <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-[#25343F14]"}>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-center" : "text-center border-r-4 border-white"}>
                                                {String(startIndex + index + 1).padStart(2, "0")}
                                            </td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : " px-3 py-4 text-left border-r-4 border-white"}>{user.fullName}</td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : " px-3 py-4 text-left border-r-4 border-white"}>{user.phoneNumber}</td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateClick(user)}
                                                        className="rounded-full bg-[#28c98b] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#20b178]">
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="rounded-full bg-[#f05b4f] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#db473d]">
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                                            Tidak ada user yang cocok dengan pencarian.
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
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-baseBlue text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
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
                                            }`}
                                    >
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

            <DialogUpdatePelajar
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                currentData={selectedUser}
                onSuccess={fetchStudents}
            />

            <DialogDeletePelajar
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                currentData={selectedUser}
                onSuccess={fetchStudents}
            />
        </section>
    );
}
