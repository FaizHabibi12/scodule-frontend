"use client";

import { useActionState, useEffect } from "react";
import { deleteKelas } from "../actions";
import { INITIAL_STATE_ACTION } from "@/src/constants/general-constant";
import { toast } from "sonner";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";

type KelasDialogData = {
    id?: number;
    name?: string;
};

export default function DialogDeleteKelas({ open, refetch, currentData, onClose }: {
    refetch: () => void;
    currentData?: KelasDialogData;
    open: boolean;
    onClose: () => void;
}) {
    const [deleteKelasState, deleteKelasAction, isPendingDeleteKelas] = useActionState(
        deleteKelas,
        INITIAL_STATE_ACTION
    );

    useEffect(() => {
        if (deleteKelasState.status === 'error' && deleteKelasState.errors) {
            toast.error('Gagal Menghapus Kelas', {
                description: deleteKelasState.errors?._form?.[0],
            });
        }

        if (deleteKelasState?.status === 'success') {
            toast.success('Kelas Berhasil Dihapus');
            onClose();
            refetch();
        }
    }, [deleteKelasState, onClose, refetch]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex gap-3 items-center mb-4">
                    <span className="border-l-[6px] rounded-full border-primary h-8">{''}</span>
                    <h2 className="text-2xl font-medium text-foreground">
                        Hapus Kelas
                    </h2>
                </div>
                <p className="text-foreground mb-6 text-base">
                    Apakah Anda yakin ingin menghapus kelas <strong>{currentData?.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan dan akan menghapus semua sub kelas yang terkait.
                </p>
                <form action={deleteKelasAction} className="flex justify-end space-x-3 pt-4 border-t">
                    <input type="hidden" name="id" value={currentData!.id!.toString()} />
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-3 flex items-center gap-2 border border-primary rounded-full font-medium text-base text-primary"
                        disabled={isPendingDeleteKelas}>
                        Batalkan
                        <IoMdCloseCircle size={19} />
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-3 flex items-center gap-2 bg-primary text-white rounded-full disabled:bg-gray-400"
                        disabled={isPendingDeleteKelas}>
                        {isPendingDeleteKelas ? "Menghapus..." : "Hapus"}
                        <IoCheckmarkCircle size={19} />
                    </button>
                </form>
            </div>
        </div>
    );
}  