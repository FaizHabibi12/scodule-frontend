import { useState } from "react";

interface ConfirmButtonProps {
    onConfirm: () => void;
    children: React.ReactNode;
    className?: string;
}

export const ConfirmButton = ({ onConfirm, children, className }: ConfirmButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={className ?? "mt-2 text-xs font-medium text-red-600 hover:text-red-800 cursor-pointer"}
            >
                {children}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Hapus Jadwal Ini?
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Tindakan ini tidak bisa dibatalkan.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    setOpen(false);
                                }}
                                className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/80 cursor-pointer transition"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
