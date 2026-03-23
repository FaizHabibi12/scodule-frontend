"use client";

import { API_CONFIG } from "@/src/lib/api-client";
import { TeacherTableRecord } from "@/src/types/user-management";
import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";

export default function DialogDeleteTentor({
    open,
    onClose,
    currentData,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    currentData?: TeacherTableRecord;
    onSuccess: () => Promise<void>;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        if (!currentData) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`${API_CONFIG.baseURL}/admin/teachers/${currentData.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${API_CONFIG.token}`,
                    Accept: "application/json",
                },
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.error || result?.message || "Gagal menghapus tentor");
            }

            toast.success("Tentor berhasil dihapus");
            await onSuccess();
            onClose();
        } catch (error) {
            toast.error("Gagal menghapus tentor", {
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
                    <h2 className="text-2xl font-medium text-foreground">Hapus Tentor</h2>
                </div>
                <p className="mb-6 text-base text-foreground">
                    Apakah Anda yakin ingin menghapus tentor <strong>{currentData.fullName}</strong>?
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
