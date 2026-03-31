"use client";

import { INITIAL_CREATE_KELAS_FORM, INITIAL_STATE_CREATE_KELAS } from "@/src/constants/kelas-constant";
import { CreateKelasForm, createKelasSchema } from "@/src/validations/kelas-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createKelas } from "../../daftar-kelas/actions";
import FormKelas from "./form-kelas";

export default function DialogCreateKelas({
    refetch,
    open,
    onClose
}: {
    refetch: () => void;
    open: boolean;
    onClose: () => void;
}) {

    const form = useForm<CreateKelasForm>({
        resolver: zodResolver(createKelasSchema),
        defaultValues: {
            ...INITIAL_CREATE_KELAS_FORM,
            // tipeKelas: "Kelas Besar",
            jumlahSiswa: 0,
        } as CreateKelasForm,
    });

    const [createKelasState, createKelasAction, isPending] = useActionState(
        createKelas,
        INITIAL_STATE_CREATE_KELAS
    );

    const onSubmit = form.handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("tipe_kelas", data.tipeKelas);
        formData.append("jumlah_siswa", data.jumlahSiswa.toString());

        startTransition(() => {
            createKelasAction(formData);
        });
    });

    useEffect(() => {
        if (createKelasState.status === 'error') {
            toast.error('Gagal Membuat Kelas', {
                description: createKelasState.errors?._form?.[0] || "Terjadi kesalahan",
            });
        }
        if (createKelasState.status === 'success') {
            toast.success('Kelas berhasil dibuat');
            form.reset();
            onClose();
            refetch();
        }
    }, [createKelasState, form, onClose, refetch]);

    return (
        <FormKelas
            form={form}
            onSubmit={onSubmit}
            isLoading={isPending}
            type="Create"
            open={open}
            onClose={onClose}
        />
    );
}