"use client";

import { INITIAL_CREATE_MAPEL_FORM, INITIAL_STATE_CREATE_MAPEL } from "@/src/constants/mapel-constant";
import { CreateMapelForm, createMapelSchema } from "@/src/validations/mapel-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createMapel } from "../actions";
import FormMapel from "./form-mapel";

export default function DialogCreateMapel({
    refetch,
    open,
    onClose
}: {
    refetch: () => void;
    open: boolean;
    onClose: () => void;
}) {

    const form = useForm<CreateMapelForm>({
        resolver: zodResolver(createMapelSchema),
        defaultValues: INITIAL_CREATE_MAPEL_FORM,
    });

    const [createMapelState, createMapelAction, isPendingCreateMapel] = useActionState(
        createMapel,
        INITIAL_STATE_CREATE_MAPEL
    );

    const onSubmit = form.handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);

        if (data.subSubjects && data.subSubjects.length > 0) {
            formData.append("subSubjects", JSON.stringify(data.subSubjects));
        }

        startTransition(() => {
            createMapelAction(formData);
        });
    });

    useEffect(() => {
        if (createMapelState.status === 'error' && createMapelState.errors) {
            toast.error('Gagal Membuat Mapel', {
                description: createMapelState.errors?._form?.[0],
            });
        }
        if (createMapelState?.status === 'success') {
            toast.success('Mapel Berhasil Dibuat');
            form.reset();
            onClose();
            refetch();
        }
    }, [createMapelState, form, onClose, refetch]);

    return (
        <FormMapel
            form={form}
            onSubmit={onSubmit}
            isLoading={isPendingCreateMapel}
            type="Create"
            open={open}
            onClose={onClose}
        />
    );
}