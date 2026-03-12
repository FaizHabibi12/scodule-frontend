"use client";

import { FormEvent, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { SubSubjectForm } from "@/src/validations/mapel-validation";
import { FaPlus } from "react-icons/fa6";
import { IoCheckmarkCircle, IoSquareOutline } from "react-icons/io5";
import { FaCheckSquare, FaTrashAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import DialogDeleteSubMapel from "./dialog-delete-sub-mapel";

export default function FormMapel<T extends Record<string, any>>({
    form,
    onSubmit,
    isLoading,
    type,
    open,
    onClose,
    initialSubSubjects,
}: {
    form: UseFormReturn<T>;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    type: 'Create' | 'Update';
    open: boolean;
    onClose: () => void;
    initialSubSubjects?: SubSubjectForm[];
}) {
    const [subSubjects, setSubSubjects] = useState<SubSubjectForm[]>(initialSubSubjects || []);
    const [showSubSubjects, setShowSubSubjects] = useState(false);
    const [markedForDeletion, setMarkedForDeletion] = useState<Set<number>>(new Set());
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
        open: boolean;
        index: number | null;
        subSubjectName: string;
    }>({ open: false, index: null, subSubjectName: '' });

    useEffect(() => {
        if (open && initialSubSubjects && initialSubSubjects.length > 0) {
            setSubSubjects(initialSubSubjects);
            setShowSubSubjects(true);
            setMarkedForDeletion(new Set());
        } else if (!open) {
            setSubSubjects([]);
            setShowSubSubjects(false);
            setMarkedForDeletion(new Set());
            setDeleteConfirmDialog({ open: false, index: null, subSubjectName: '' });
        }
    }, [open, initialSubSubjects]);

    const handleAddSubSubject = () => {
        setSubSubjects([...subSubjects, { name: "" }]);
    };

    const handleRemoveSubSubject = (index: number) => {
        const subSubject = subSubjects[index];

        if (markedForDeletion.has(index)) {
            setMarkedForDeletion(prev => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
            });
        } else {
            if (!subSubject.name || subSubject.name.trim() === "") {
                setSubSubjects(prev => prev.filter((_, i) => i !== index));
                setMarkedForDeletion(prev => {
                    const newSet = new Set<number>();
                    prev.forEach(markedIndex => {
                        if (markedIndex < index) {
                            newSet.add(markedIndex);
                        } else if (markedIndex > index) {
                            newSet.add(markedIndex - 1);
                        }
                    });
                    return newSet;
                });
            } else {
                setDeleteConfirmDialog({
                    open: true,
                    index: index,
                    subSubjectName: subSubject.name
                });
            }
        }
    };

    const confirmDeleteSubSubject = () => {
        if (deleteConfirmDialog.index !== null) {
            setMarkedForDeletion(prev => {
                const newSet = new Set(prev);
                newSet.add(deleteConfirmDialog.index!);
                return newSet;
            });
        }
        setDeleteConfirmDialog({ open: false, index: null, subSubjectName: '' });
    };

    const cancelDeleteSubSubject = () => {
        setDeleteConfirmDialog({ open: false, index: null, subSubjectName: '' });
    };

    const handleSubSubjectChange = (index: number, value: string) => {
        const updated = [...subSubjects];
        updated[index].name = value;
        setSubSubjects(updated);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (showSubSubjects) {
            const validSubSubjects = subSubjects
                .filter((_, index) => !markedForDeletion.has(index))
                .filter(ss => ss.name.trim() !== "");

            if (validSubSubjects.length === 0 && subSubjects.some((_, i) => !markedForDeletion.has(i))) {
                return;
            }
            form.setValue("subSubjects" as any, validSubSubjects as any);

            const toDelete = subSubjects
                .filter((_, index) => markedForDeletion.has(index))
                .filter(ss => ss.id)
                .map(ss => ss.id);

            form.setValue("subSubjectsToDelete" as any, toDelete as any);
        } else {
            form.setValue("subSubjects" as any, [] as any);
            form.setValue("subSubjectsToDelete" as any, [] as any);
        }

        onSubmit(e);
    };

    if (!open) return null;

    return (
        <div>
            <DialogDeleteSubMapel
                open={deleteConfirmDialog.open}
                subSubjectName={deleteConfirmDialog.subSubjectName}
                onConfirm={confirmDeleteSubSubject}
                onCancel={cancelDeleteSubSubject}
                isUpdate={type === 'Update'}            />

            <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-3 item-center">
                                <span className="border-l-[6px] rounded-full border-primary">{''}</span>
                                <h3 className="text-[32px] font-medium text-foreground">
                                    {type} Mapel
                                </h3>
                            </div>
                            <button
                                title="Tambah Mapel"
                                type="button"
                                onClick={onClose}
                                className="text-foreground">
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-base font-normal text-foreground mb-1">
                                    Nama Mapel
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...form.register("name" as any)}
                                    className="w-full px-3 text-foreground py-3 bg-[#F4F4F5] rounded-lg focus:outline-none"
                                    placeholder="Masukkan nama mapel" />
                                {form.formState.errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.name.message as string}
                                    </p>
                                )}
                            </div>

                            <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => {
                                    setShowSubSubjects(!showSubSubjects);
                                    if (showSubSubjects) {
                                        setSubSubjects([]);
                                    }
                                }}>
                                {showSubSubjects ? (
                                    <FaCheckSquare size={23} className="text-primary" />
                                ) : (
                                    <IoSquareOutline size={23} className="text-muted" />
                                )}

                                <span className="text-base font-normal text-foreground">
                                    Sub Mapel
                                </span>
                            </div>

                            {showSubSubjects && (
                                <div className="space-y-3 border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Sub Mapel</h3>


                                    {subSubjects.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Belum ada sub mapel. Klik "+ nama sub mapel" untuk menambahkan.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex space-x-2">
                                                <table className="min-w-full border-collapse border-gray-400">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-muted text-left py-2 px-2 text-base border-b border-gray-400 font-light">Nama Sub Mapel</th>
                                                            <th className="text-muted text-base border-b border-gray-400 font-light">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {subSubjects.map((subSubject, index) => {

                                                            const isMarked = markedForDeletion.has(index);
                                                            return (
                                                                <tr key={subSubject.id || index} className={isMarked ? "bg-red-50" : ""}>
                                                                    <td className="py-3 text-sm font-normal border-y-2 border-[#D4D4D8] text-foreground text-center">
                                                                        <input
                                                                            type="text"
                                                                            value={subSubject.name}
                                                                            onChange={(e) => handleSubSubjectChange(index, e.target.value)}
                                                                            className={`w-full px-3 py-2 text-foreground rounded-md focus:outline-none ${isMarked ? 'line-through opacity-50 bg-red-50' : ''
                                                                                }`}
                                                                            placeholder={`${index + 1} Tambahkan sub mapel disini... `}
                                                                            disabled={isMarked}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center text-sm font-normal border-y-2 border-l-2 border-[#D4D4D8] text-foreground">
                                                                        <button
                                                                            title={isMarked ? "Batalkan hapus" : "Hapus sub mapel"}
                                                                            type="button"
                                                                            onClick={() => handleRemoveSubSubject(index)}
                                                                            className={`p-2 transition-colors ${isMarked ? 'text-green-600' : 'text-primary'
                                                                                }`}>
                                                                            <FaTrashAlt size={20} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleAddSubSubject}
                                        className="flex items-center gap-2 py-2 text-base font-normal text-muted">
                                        <FaPlus size={16} />
                                        <span>Nama Sub Mapel</span>
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-3 flex items-center gap-2 border border-primary rounded-full font-medium text-base text-primary"
                                    disabled={isLoading}>
                                    Batalkan
                                    <IoMdCloseCircle size={19} />
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-3 flex items-center gap-2 bg-primary text-white rounded-full disabled:bg-gray-400"
                                    disabled={isLoading}>
                                    {isLoading ? "Menyimpan..." : type === 'Create' ? "Simpan" : "Konfirmasi"}
                                    <IoCheckmarkCircle size={19} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}