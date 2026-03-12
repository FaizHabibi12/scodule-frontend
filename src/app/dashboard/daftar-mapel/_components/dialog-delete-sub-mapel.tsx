"use client";

import { IoMdCloseCircle } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function DialogDeleteSubMapel({
    open,
    subSubjectName,
    onConfirm,
    onCancel,
    isUpdate = false
}: {
    open: boolean;
    subSubjectName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isUpdate?: boolean;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex gap-3 items-center mb-4">
                    <span className="border-l-[6px] rounded-full border-primary h-8">{''}</span>
                    <h2 className="text-2xl font-medium text-foreground">
                        Hapus Sub Mapel
                    </h2>
                </div>
                <p className="text-foreground mb-6 text-base">
                    Apakah Anda yakin ingin menghapus sub mapel <strong>{subSubjectName}</strong>?
                    {isUpdate && ' Sub mapel ini akan dihapus dari database saat Anda menekan tombol "Konfirmasi".'}
                </p>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-3 flex items-center gap-2 border border-primary rounded-full font-medium text-base text-primary">
                        Batalkan
                        <IoMdCloseCircle size={19} />
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-5 py-3 flex items-center gap-2 bg-primary text-white rounded-full">
                        Konfirmasi
                        <IoCheckmarkCircle size={19} />
                    </button>
                </div>
            </div>
        </div>
    );
}
