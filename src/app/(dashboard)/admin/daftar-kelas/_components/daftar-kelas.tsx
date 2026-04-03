"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/src/lib/api-client";
import DialogCreateKelas from "./dialog-create-kelas";
import DialogUpdateKelas from "./dialog-update-kelas";
import DialogDeleteKelas from "./dialog-delete-kelas";
import Search from "./search";
import { CiSearch } from "react-icons/ci";
import { TbLayoutGridAdd } from "react-icons/tb";

type KelasRecord = {
    id?: number;
    name?: string;
    nama_kelas?: string;
    tipe_kelas?: "Kelas Besar" | "Kelas Kecil";
    jumlah_siswa?: number;
    jumlah?: number;
};

type SubjectListResponse = {
    data?: KelasRecord[] | { data?: KelasRecord[] };
};

export default function DaftarKelasManagement() {
    const [kelasList, setKelasList] = useState<KelasRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10); // Bisa dibuat dinamis nanti

    const [dialogState, setDialogState] = useState<{
        create: boolean;
        update: boolean;
        delete: boolean;
        currentData?: KelasRecord;
    }>({
        create: false,
        update: false,
        delete: false,
    });

    const fetchKelas = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await apiRequest<SubjectListResponse>('/subjects'); // Ganti endpoint jika berbeda

            if (error) {
                toast.error('Gagal mengambil data kelas', { description: error });
                setKelasList([]);
                return;
            }

            const kelasData = data?.data
                ? (Array.isArray(data.data) ? data.data : (data.data.data ?? []))
                : [];

            setKelasList(kelasData);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
            toast.error('Gagal mengambil data kelas', {
                description: message,
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

    const handleOpenUpdate = (kelas: KelasRecord) => {
        setDialogState(prev => ({
            ...prev,
            update: true,
            currentData: kelas
        }));
    };

    const handleOpenDelete = (kelas: KelasRecord) => {
        setDialogState(prev => ({
            ...prev,
            delete: true,
            currentData: kelas
        }));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
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

    // Pagination
    const totalPages = Math.ceil(filteredKelas.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const paginatedKelas = filteredKelas.slice(startIndex, startIndex + limit);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-[#23323d] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium w-17">NO</th>
                                <th className="px-6 py-4 text-left font-medium">Nama Kelas</th>
                                <th className="px-6 py-4 text-left font-medium">Tipe Kelas</th>
                                <th className="px-6 py-4 text-center font-medium">Jumlah Siswa</th>
                                <th className="px-6 py-4 text-center font-medium w-40">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : paginatedKelas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        {searchQuery 
                                            ? `Tidak ada kelas yang cocok dengan "${searchQuery}"` 
                                            : "Tidak ada data kelas"}
                                    </td>
                                </tr>
                            ) : (
                                paginatedKelas.map((kelas, index) => (
                                    <tr key={kelas.id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-center font-medium">
                                            {String(startIndex + index + 1).padStart(2, "0")}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {kelas.name || kelas.nama_kelas}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {kelas.tipe_kelas || "Kelas Besar"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center font-medium">
                                            {kelas.jumlah_siswa || kelas.jumlah || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => handleOpenUpdate(kelas)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(kelas)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors"
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

                {/* Pagination (sederhana) */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">
                            Menampilkan {startIndex + 1}–{Math.min(startIndex + limit, filteredKelas.length)} dari {filteredKelas.length} data
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <DialogCreateKelas
                open={dialogState.create}
                onClose={() => setDialogState(prev => ({ ...prev, create: false }))}
                refetch={fetchKelas}
            />
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