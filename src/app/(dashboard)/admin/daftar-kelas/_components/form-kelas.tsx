"use client";

import { FormEvent, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "sonner";

export default function FormKelas<T extends Record<string, any>>({
    form,
    onSubmit,
    isLoading,
    type,
    open,
    onClose,
}: {
    form: UseFormReturn<T>;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    type: 'Create' | 'Update';
    open: boolean;
    onClose: () => void;
}) {

    const { formState: { isValid, isDirty, errors } } = form;
    const canSubmit = isValid && isDirty && !isLoading;

    // Alert otomatis ketika ada error validasi
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors)
                .map((error: any) => error.message)
                .filter(Boolean);

            if (errorMessages.length > 0) {
                toast.error("Data tidak sesuai", {
                    description: errorMessages[0], // Tampilkan error pertama
                    duration: 4000,
                });
            }
        }
    }, [errors]);

    // Fungsi Batalkan dengan reset form
    const handleCancel = () => {
        form.reset();
        onClose();
    };

    if (!open) return null;

    return (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-orange-500 rounded-full" />
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {type === 'Create' ? 'Tambah Kelas Baru' : 'Edit Kelas'}
                        </h2>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="px-8 py-8 space-y-6">
                    {/* Nama Kelas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Kelas
                        </label>
                        <input
                            type="text"
                            {...form.register("name" as any)}
                            className="w-full px-4 py-3.5 bg-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder:text-gray-400"
                            placeholder="Isi nama kelas"
                        />
                        {form.formState.errors.name && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {form.formState.errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* Tipe Kelas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipe Kelas
                        </label>
                        <select
                            {...form.register("tipeKelas" as any)}
                            className="w-full px-4 py-3.5 bg-zinc-100 border border-transparent focus:border-blue-500 rounded-2xl focus:outline-none text-base appearance-none"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Pilih Tipe Kelas
                            </option>
                            <option value="Kelas Besar">Kelas Besar</option>
                            <option value="Kelas Kecil">Kelas Kecil</option>
                        </select>
                        {form.formState.errors.tipeKelas && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {form.formState.errors.tipeKelas.message as string}
                            </p>
                        )}
                    </div>

                    {/* Jumlah Siswa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jumlah Siswa
                        </label>
                        <input
                            type="number"
                            {...form.register("jumlahSiswa" as any, { valueAsNumber: true })}
                            min="1" max="30"
                            className="w-full px-4 py-3.5 bg-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                            placeholder="0"
                        />
                        {form.formState.errors.jumlahSiswa && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {form.formState.errors.jumlahSiswa.message as string}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
                        >
                            Batalkan
                        </button>

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`px-8 py-3 text-white rounded-full font-medium flex items-center gap-2 transition-all ${
                                canSubmit 
                                    ? 'bg-primary hover:bg-[#1D4ED8]' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                            {!isLoading && <IoCheckmarkCircle size={20} />}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}