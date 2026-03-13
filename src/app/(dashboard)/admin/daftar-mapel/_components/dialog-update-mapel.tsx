"use client";

import { INITIAL_UPDATE_MAPEL_FORM, INITIAL_STATE_UPDATE_MAPEL } from "@/src/constants/mapel-constant";
import { UpdateMapelForm, updateMapelSchema } from "@/src/validations/mapel-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateMapel } from "../actions";
import FormMapel from "./form-mapel";
import { Subject } from "@/src/types/mapel";

export default function DialogUpdateMapel({
    refetch,
    currentData,
    open,
    onClose
}: {
    refetch: () => void;
    currentData?: Subject;
    open: boolean;
    onClose: () => void;
}) {

    const form = useForm<UpdateMapelForm>({
        resolver: zodResolver(updateMapelSchema),
        defaultValues: INITIAL_UPDATE_MAPEL_FORM,
    });

    const [updateMapelState, updateMapelAction, isPendingUpdateMapel] = useActionState(
        updateMapel,
        INITIAL_STATE_UPDATE_MAPEL
    );

    const onSubmit = form.handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append("id", currentData?.id?.toString() || "");
        formData.append("name", data.name);

        if (data.subSubjects && data.subSubjects.length > 0) {
            formData.append("subSubjects", JSON.stringify(data.subSubjects));
        }

        if (data.subSubjectsToDelete && data.subSubjectsToDelete.length > 0) {
            formData.append("subSubjectsToDelete", JSON.stringify(data.subSubjectsToDelete));
        }

        startTransition(() => {
            updateMapelAction(formData);
        });
    });

    useEffect(() => {
        if (updateMapelState.status === 'error' && updateMapelState.errors) {
            toast.error('Gagal Update Mapel', {
                description: updateMapelState.errors?._form?.[0],
            });
        }
        if (updateMapelState?.status === 'success') {
            toast.success('Mapel Berhasil Diupdate');
            form.reset();
            onClose();
            refetch();
        }
    }, [updateMapelState, form, onClose, refetch]);

    useEffect(() => {
        if (currentData && open) {
            form.setValue('name', currentData.name);
            if (currentData.sub_subjects && currentData.sub_subjects.length > 0) {
                form.setValue('subSubjects', currentData.sub_subjects.map(ss => ({
                    id: ss.id,
                    name: ss.name
                })));
            } else {
                form.setValue('subSubjects', []);
            }
        }
    }, [currentData, open, form]);

    return (
        <FormMapel
            form={form}
            onSubmit={onSubmit}
            isLoading={isPendingUpdateMapel}
            type="Update"
            open={open}
            onClose={onClose}
            initialSubSubjects={currentData?.sub_subjects?.map(ss => ({
                id: ss.id,
                name: ss.name
            }))}
        />
    );
}