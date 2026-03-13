"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Subject } from "@/src/types/mapel";
import { IoChevronDown } from "react-icons/io5";
import { apiRequest } from "@/src/lib/api-client";
import DialogCreateMapel from "./dialog-create-mapel";
import DialogUpdateMapel from "./dialog-update-mapel";
import DialogDeleteMapel from "./dialog-delete-mapel";
import Search from "./search";
import { PiBookOpenTextFill } from "react-icons/pi";
import { RiEdit2Fill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { TbLayoutGridAdd } from "react-icons/tb";
import { LIMIT_LIST, DEFAULT_LIMIT, DEFAULT_PAGE } from "@/src/constants/data-table-constant";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function DaftarMapelManagement() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);

    const [dialogState, setDialogState] = useState<{
        create: boolean;
        update: boolean;
        delete: boolean;
        currentData?: Subject;
    }>({
        create: false,
        update: false,
        delete: false,
    });

    const fetchSubjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await apiRequest('/subjects');

            if (error) {
                toast.error('Gagal mengambil data mapel', {
                    description: error,
                });
                setSubjects([]);
                return;
            }

            if (data) {
                if (data.data && Array.isArray(data.data)) {
                    setSubjects(data.data);
                } else if (Array.isArray(data)) {
                    setSubjects(data);
                } else {
                    setSubjects([]);
                }
            } else {
                setSubjects([]);
            }
        } catch (error: any) {
            toast.error('Gagal mengambil data mapel', {
                description: error.message,
            });
            setSubjects([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const toggleExpanded = (subjectId: number) => {
        setExpandedSubjects(prev => {
            const newSet = new Set<number>();
            if (!prev.has(subjectId)) {
                newSet.add(subjectId);
            }
            return newSet;
        });
    };

    const handleOpenCreate = useCallback(() => {
        setDialogState(prev => ({ ...prev, create: true }));
    }, []);

    const handleCloseCreate = useCallback(() => {
        setDialogState(prev => ({ ...prev, create: false }));
    }, []);

    const handleOpenUpdate = useCallback((subject: Subject) => {
        setDialogState(prev => ({
            ...prev,
            update: true,
            currentData: subject
        }));
    }, []);

    const handleCloseUpdate = useCallback(() => {
        setDialogState(prev => ({
            ...prev,
            update: false,
            currentData: undefined
        }));
    }, []);

    const handleOpenDelete = useCallback((subject: Subject) => {
        setDialogState(prev => ({
            ...prev,
            delete: true,
            currentData: subject
        }));
    }, []);

    const handleCloseDelete = useCallback(() => {
        setDialogState(prev => ({
            ...prev,
            delete: false,
            currentData: undefined
        }));
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredSubjects = subjects.filter(subject => {
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        const nameMatch = subject.name.toLowerCase().includes(searchLower);

        const subSubjectMatch = subject.sub_subjects?.some(
            sub => sub.name.toLowerCase().includes(searchLower)
        );

        return nameMatch || subSubjectMatch;
    });

    const totalPages = Math.ceil(filteredSubjects.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, limit]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
    };

    return (
        <section className="w-full px-12">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col mt-6 gap-4 w-full">
                    <h5 className="text-2xl font-medium text-black">Daftar Mapel</h5>
                    <div className="flex justify-between">
                        <div className="w-[30%] relative">
                            <Search
                                url="/dashboard/daftar-mapel"
                                search={searchQuery}
                                onSearchChange={handleSearch} />
                            <CiSearch
                                size={25}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-full font-medium text-base">
                            Mapel Baru
                            <TbLayoutGridAdd size={22} />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                            Loading...
                        </div>
                    ) : filteredSubjects.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                            {searchQuery
                                ? `Tidak ada mapel yang cocok dengan "${searchQuery}"`
                                : "Tidak ada data mapel"
                            }
                        </div>
                    ) : (
                        paginatedSubjects.map((subject) => {
                            if (!subject.id) return null;

                            const isExpanded = expandedSubjects.has(subject.id);

                            return (
                                <div key={subject.id}
                                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                                    <div
                                        className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors`}
                                        onClick={() => toggleExpanded(subject.id!)}>
                                        <div className="gap-3">
                                            <h3 className={`text-xl flex item-center gap-4 transition-colors ${isExpanded ? 'text-primary font-bold' : 'text-muted'}`}>
                                                <PiBookOpenTextFill size={24} className={`${isExpanded ? 'text-primary' : 'text-muted'}`} />
                                                {subject.name}
                                            </h3>
                                        </div>
                                        <button
                                            title="button-arrow"
                                            className={`transition-transform duration-300 ease-in-out text-muted ${isExpanded ? "rotate-180" : "rotate-0"}`}>
                                            <IoChevronDown size={24} />
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                            {subject.sub_subjects && subject.sub_subjects.length > 0 ? (
                                                <div>
                                                    <div className="mb-4 bg-white rounded-lg overflow-hidden border border-gray-200">
                                                        <table className="min-w-full border-separate border-spacing-2">
                                                            <thead className="bg-baseBlue">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-base text-center font-light text-white w-12">
                                                                        NO
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-base font-light text-white">
                                                                        Sub Mapel
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200">
                                                                {subject.sub_subjects.map((subSubject, index) => (
                                                                    <tr key={subSubject.id || index} className="odd:bg-white even:bg-[#25343F1A]">
                                                                        <td className="px-4 py-3 text-sm font-normal text-foreground text-center">
                                                                            {String(index + 1).padStart(2, "0")}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm font-normal text-foreground">
                                                                            {subSubject.name}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenUpdate(subject);
                                                            }}
                                                            className="bg-white border text-primary border-primary py-2 px-4 rounded-full font-medium text-base flex items-center gap-2">
                                                            Edit Mapel
                                                            <RiEdit2Fill size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-normal text-muted">
                                                        <i>Tidak ada sub mapel</i>
                                                    </span>
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenUpdate(subject);
                                                            }}
                                                            className="bg-white border text-primary border-primary py-2 px-4 rounded-full font-medium text-base flex items-center gap-2">
                                                            Edit Mapel
                                                            <RiEdit2Fill size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {!isLoading && filteredSubjects.length > 0 && totalPages > 1 && (
                <div className="flex justify-between items-center gap-2 m-6">
                    <div>
                        <span className="text-sm text-gray-600 mr-2">Data per halaman:</span>
                        <select
                            title="Pilih jumlah data per halaman"
                            value={limit}
                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                            className="px-2 py-1 border text-muted border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            {LIMIT_LIST.map(limitOption => (
                                <option key={limitOption} value={limitOption}>
                                    {limitOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            title="Halaman sebelumnya"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-md text-muted disabled:opacity-50 disabled:cursor-not-allowed">
                            <IoChevronBackOutline size={20} />
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                const showPage = (page >= currentPage && page <= currentPage + 1);

                                if (!showPage) {
                                    return null;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 border rounded-md ${currentPage === page
                                            ? 'bg-primary text-white font-semibold'
                                            : 'border-gray-300 text-muted'
                                            }`}>
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            title="Halaman berikutnya"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 text-muted rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            <IoChevronForwardOutline size={20} />
                        </button>
                    </div>
                </div>
            )}

            <DialogCreateMapel
                open={dialogState.create}
                onClose={handleCloseCreate}
                refetch={fetchSubjects}
            />
            <DialogUpdateMapel
                open={dialogState.update}
                onClose={handleCloseUpdate}
                refetch={fetchSubjects}
                currentData={dialogState.currentData}
            />
            <DialogDeleteMapel
                open={dialogState.delete}
                onClose={handleCloseDelete}
                refetch={fetchSubjects}
                currentData={dialogState.currentData}
            />
        </section>
    );
}