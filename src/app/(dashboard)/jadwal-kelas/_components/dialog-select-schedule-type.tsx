"use client";

interface DialogSelectScheduleTypeProps {
    open: boolean;
    onClose: () => void;
    onSelect: (type: "regular" | "private") => void;
}

export default function DialogSelectScheduleType({
    open,
    onClose,
    onSelect,
}: DialogSelectScheduleTypeProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-3xl bg-white p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-[#1e1e1e]">
                        Pilih Tipe Jadwal
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Pilih tipe jadwal yang ingin Anda buat
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => {
                            onSelect("regular");
                            onClose();
                        }}
                        className="w-full rounded-2xl border-2 border-baseBlue p-4 text-center transition hover:bg-blue-50"
                    >
                        <div className="text-lg font-semibold text-baseBlue">Jadwal Biasa</div>
                        <div className="text-sm text-slate-600">
                            Jadwal reguler kelas untuk semua siswa
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            onSelect("private");
                            onClose();
                        }}
                        className="w-full rounded-2xl border-2 border-[#28c98b] p-4 text-center transition hover:bg-green-50"
                    >
                        <div className="text-lg font-semibold text-[#28c98b]">Jadwal Privat</div>
                        <div className="text-sm text-slate-600">
                            Jadwal khusus untuk siswa individu
                        </div>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-2xl border border-[#d9d9d9] px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Batal
                </button>
            </div>
        </div>
    );
}
