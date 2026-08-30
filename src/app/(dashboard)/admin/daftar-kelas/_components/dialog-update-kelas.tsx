"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateKelas } from "../../daftar-kelas/actions"; // pastikan action ini ada
import { CreateKelasForm, createKelasSchema } from "@/src/validations/kelas-validation"; // reuse schema
import FormKelas from "./form-kelas";

type UpdateKelasProps = {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
    currentData?: any;
};

export default function DialogUpdateKelas({
    open,
    onClose,
    refetch,
    currentData,
}: UpdateKelasProps) {

    const form = useForm<CreateKelasForm>({
        resolver: zodResolver(createKelasSchema),
        defaultValues: {
            name: currentData?.name || "",
            tipeKelas: currentData?.tipe_kelas || "Kelas Besar",
            jumlahSiswa: currentData?.jumlah_siswa || 12,
        },
    });

    const [updateState, updateAction, isPending] = useActionState(
        updateKelas, // kamu harus buat action ini
        { status: 'idle', errors: undefined }
    );

    const onSubmit = form.handleSubmit(async (data) => {
        if (!currentData?.id) return;

        const formData = new FormData();
        formData.append("id", currentData.id.toString());
        formData.append("name", data.name);
        formData.append("tipe_kelas", data.tipeKelas);
        formData.append("jumlah_siswa", data.jumlahSiswa.toString());

        startTransition(() => {
            updateAction(formData);
        });
    });

    useEffect(() => {
        if (updateState.status === 'error') {
            toast.error('Gagal mengupdate kelas', {
                description: updateState.errors?._form?.[0] || "Terjadi kesalahan",
            });
        }
        if (updateState.status === 'success') {
            toast.success('Kelas berhasil diupdate');
            onClose();
            refetch();
        }
    }, [updateState, onClose, refetch]);

    // Reset form ketika currentData berubah
    useEffect(() => {
        if (currentData && open) {
            form.reset({
                name: currentData.name || "",
                tipeKelas: currentData.tipe_kelas || "Kelas Besar",
                jumlahSiswa: currentData.jumlah_siswa || 12,
            });
        }
    }, [currentData, open, form]);

    return (
        <FormKelas
            form={form}
            onSubmit={onSubmit}
            isLoading={isPending}
            type="Update"
            open={open}
            onClose={onClose}
        />
    );
}