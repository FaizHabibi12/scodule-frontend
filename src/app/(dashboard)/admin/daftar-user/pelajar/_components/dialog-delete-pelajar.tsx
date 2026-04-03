"use client";

import { apiRequest } from "@/src/lib/api-client";
import { StudentTableRecord } from "@/src/types/user-management";
import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";

export default function DialogDeletePelajar({
    open,
    onClose,
    currentData,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    currentData?: StudentTableRecord;
    onSuccess: () => Promise<void>;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        if (!currentData) {
            return;
        }

        setIsDeleting(true);

        try {
            const { error } = await apiRequest<{ message: string }>(`/admin/students/${currentData.id}`, {
                method: "DELETE",
            });

            if (error) {
                throw new Error(error || "Gagal menghapus pelajar");
            }

            toast.success("Pelajar berhasil dihapus");
            await onSuccess();
            onClose();
        } catch (error) {
            toast.error("Gagal menghapus pelajar", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data.",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (!open || !currentData) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                    <span className="h-8 rounded-full border-l-[6px] border-primary">{""}</span>
                    <h2 className="text-2xl font-medium text-foreground">Hapus Pelajar</h2>
                </div>
                <p className="mb-6 text-base text-foreground">
                    Apakah Anda yakin ingin menghapus pelajar <strong>{currentData.fullName}</strong>?
                </p>
                <div className="flex justify-end space-x-3 border-t pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-full border border-primary px-4 py-3 text-base font-medium text-primary"
                        disabled={isDeleting}
                    >
                        Batalkan
                        <IoMdCloseCircle size={19} />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white disabled:bg-gray-400"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                        <IoCheckmarkCircle size={19} />
                    </button>
                </div>
            </div>
        </div>
    );
}
