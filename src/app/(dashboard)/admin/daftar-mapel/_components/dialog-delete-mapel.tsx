"use client";

import { startTransition, useActionState, useEffect } from "react";
import { deleteMapel } from "../actions";
import { INITIAL_STATE_ACTION } from "@/src/constants/general-constant";
import { toast } from "sonner";
import { Subject } from "@/src/types/mapel";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function DialogDeleteMapel({ open, refetch, currentData, onClose }: {
    refetch: () => void;
    currentData?: Subject;
    open: boolean;
    onClose: () => void;
}) {
    const [deleteMapelState, deleteMapelAction, isPendingDeleteMapel] = useActionState(
        deleteMapel,
        INITIAL_STATE_ACTION
    );

    const onSubmit = () => {
        const formData = new FormData();
        formData.append('id', currentData!.id!.toString());
        startTransition(() => {
            deleteMapelAction(formData);
        });
    };

    useEffect(() => {
        if (deleteMapelState.status === 'error' && deleteMapelState.errors) {
            toast.error('Gagal Menghapus Mapel', {
                description: deleteMapelState.errors?._form?.[0],
            });
        }

        if (deleteMapelState?.status === 'success') {
            toast.success('Mapel Berhasil Dihapus');
            onClose();
            refetch();
        }
    }, [deleteMapelState, onClose, refetch]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex gap-3 items-center mb-4">
                    <span className="border-l-[6px] rounded-full border-primary h-8">{''}</span>
                    <h2 className="text-2xl font-medium text-foreground">
                        Hapus Mapel
                    </h2>
                </div>
                <p className="text-foreground mb-6 text-base">
                    Apakah Anda yakin ingin menghapus mapel <strong>{currentData?.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan dan akan menghapus semua sub mapel yang terkait.
                </p>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-3 flex items-center gap-2 border border-primary rounded-full font-medium text-base text-primary"
                        disabled={isPendingDeleteMapel}>
                        Batalkan
                        <IoMdCloseCircle size={19} />
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="px-5 py-3 flex items-center gap-2 bg-primary text-white rounded-full disabled:bg-gray-400"
                        disabled={isPendingDeleteMapel}>
                        {isPendingDeleteMapel ? "Menghapus..." : "Hapus"}
                        <IoCheckmarkCircle size={19} />
                    </button>
                </div>
            </div>
        </div>
    );
}  