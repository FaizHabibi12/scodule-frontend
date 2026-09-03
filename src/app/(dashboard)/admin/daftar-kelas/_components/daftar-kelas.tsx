"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Subject } from "@/src/types/kelas"; // Pastikan tipe ini sesuai atau kamu ubah
import { apiRequest } from "@/src/lib/api-client";
import { DEFAULT_PAGE } from "@/src/constants/data-table-constant";
import DialogCreateKelas from "./dialog-create-kelas";
import DialogUpdateKelas from "./dialog-update-kelas";
import DialogDeleteKelas from "./dialog-delete-kelas";
import Search from "./search";
import { CiSearch } from "react-icons/ci";
import { TbLayoutGridAdd } from "react-icons/tb";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const ITEMS_PER_PAGE = 6;
const EDGE_VISIBLE_PAGES = 4;
type PaginationItem = number | "ellipsis";

export default function DaftarKelasManagement() {
    const [kelasList, setKelasList] = useState<any[]>([]); // Ubah tipe sesuai kebutuhan
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

    const [dialogState, setDialogState] = useState<{
        create: boolean;
        update: boolean;
        delete: boolean;
        currentData?: any;
    }>({
        create: false,
        update: false,
        delete: false,
    });

    const fetchKelas = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await apiRequest('/admin/classes');

            if (error) {
                toast.error('Gagal mengambil data kelas', { description: error });
                setKelasList([]);
                return;
            }

            const kelasData = data?.data && Array.isArray(data.data)
                ? data.data
                : Array.isArray(data) ? data : [];

            setKelasList(kelasData);
        } catch (error: any) {
            toast.error('Gagal mengambil data kelas', {
                description: error.message,
            });
            setKelasList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchKelas();
    }, [fetchKelas]);

    const handleOpenCreate = () => {
        setDialogState(prev => ({ ...prev, create: true }));
    };

    const handleCloseCreate = useCallback(() => {
        setDialogState(prev => ({ ...prev, create: false }));
    }, []);

    const handleOpenUpdate = (kelas: any) => {
        setDialogState(prev => ({
            ...prev,
            update: true,
            currentData: kelas
        }));
    };

    const handleOpenDelete = (kelas: any) => {
        setDialogState(prev => ({
            ...prev,
            delete: true,
            currentData: kelas
        }));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(DEFAULT_PAGE);
    };

    // Filter berdasarkan search
    const filteredKelas = kelasList.filter(kelas => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            kelas.name?.toLowerCase().includes(q) ||
            kelas.tipe_kelas?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredKelas.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentKelas = filteredKelas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

    return (
        <section className="w-full px-12">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col mt-6 gap-4 w-full">
                    <h5 className="text-2xl font-medium text-black">Daftar Kelas</h5>

                    <div className="flex justify-between items-center">
                        <div className="w-[30%] relative">
                            <Search
                                url="/dashboard/daftar-kelas"
                                search={searchQuery}
                                onSearchChange={handleSearch}
                            />
                            <CiSearch
                                size={25}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                            />
                        </div>

                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-full font-medium text-base hover:bg-primary/90 transition-colors"
                        >
                            Kelas Baru
                            <TbLayoutGridAdd size={22} />
                        </button>
                    </div>
                </div>

                {/* Tabel */}
                <div className="rounded-3xl bg-white p-3 shadow-[0_12px_40px_rgba(37,52,63,0.08)]">
                    <div className="overflow-x-auto rounded-[18px] border border-[#d9d9d9] bg-white">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="bg-[#23323d] text-white">
                                <tr>
                                    <th className="px-3 py-4 border-r-4 text-sm text-center font-medium w-15">NO</th>
                                    <th className="px-3 py-4 border-r-4 text-left text-sm font-medium">Nama Kelas</th>
                                    <th className="px-3 py-4 border-r-4 text-left text-sm font-medium">Tipe Kelas</th>
                                    <th className="px-3 py-4 border-r-4 text-left text-sm font-medium">Jumlah Siswa</th>
                                    <th className="px-3 py-4 border-r-4 text-left text-sm font-medium w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : currentKelas.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            {searchQuery
                                                ? `Tidak ada kelas yang cocok dengan "${searchQuery}"`
                                                : "Tidak ada data kelas"}
                                        </td>
                                    </tr>
                                ) : (
                                    currentKelas.map((kelas, index) => (
                                        <tr key={kelas.id || index} className={index % 2 === 0 ? "bg-white" : "bg-[#25343F14]"}>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-center" : "text-center border-r-4 border-white"}>
                                                {String(startIndex + index + 1).padStart(2, "0")}
                                            </td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : "text-left px-3 py-4 border-r-4 border-white"}>
                                                {kelas.name || kelas.nama_kelas}
                                            </td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : "text-left px-3 py-4 border-r-4 border-white"}>
                                                {kelas.tipe_kelas || "Kelas Besar"}
                                            </td>
                                            <td className={index % 2 === 0 ? "px-3 py-4 text-sm text-left" : "text-left px-3 py-4 border-r-4 border-white"}>
                                                {kelas.jumlah_siswa || kelas.jumlah || 0}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleOpenUpdate(kelas)}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDelete(kelas)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-colors"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
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

            {/* Dialogs */}
            {dialogState.create && (
                <DialogCreateKelas
                    open={dialogState.create}
                    onClose={handleCloseCreate}
                    refetch={fetchKelas}
                />
            )}
            <DialogUpdateKelas
                open={dialogState.update}
                onClose={() => setDialogState(prev => ({ ...prev, update: false, currentData: undefined }))}
                refetch={fetchKelas}
                currentData={dialogState.currentData}
            />
            <DialogDeleteKelas
                open={dialogState.delete}
                onClose={() => setDialogState(prev => ({ ...prev, delete: false, currentData: undefined }))}
                refetch={fetchKelas}
                currentData={dialogState.currentData}
            />
        </section>
    );
}