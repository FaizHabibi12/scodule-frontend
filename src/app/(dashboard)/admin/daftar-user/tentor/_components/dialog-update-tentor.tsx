"use client";

import { INITIAL_UPDATE_USER_FORM } from "@/src/constants/user-management-constant";
import { API_CONFIG } from "@/src/lib/api-client";
import { TeacherTableRecord } from "@/src/types/user-management";
import {
    updateUserNameSchema,
    UpdateUserNameFormValues,
} from "@/src/validations/user-management-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";

export default function DialogUpdateTentor({
    open,
    onClose,
    currentData,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    currentData?: TeacherTableRecord;
    onSuccess: () => Promise<void>;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UpdateUserNameFormValues>({
        resolver: zodResolver(updateUserNameSchema),
        defaultValues: INITIAL_UPDATE_USER_FORM,
    });

    useEffect(() => {
        if (open && currentData) {
            form.reset({ name: currentData.fullName });
        }
    }, [open, currentData, form]);

    const onSubmit = form.handleSubmit(async (values) => {
        if (!currentData) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_CONFIG.baseURL}/admin/users/${currentData.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    kode_user: currentData.kodeUser,
                    name: values.name,
                    role: currentData.role,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.error || result?.message || "Gagal memperbarui tentor");
            }

            toast.success("Data tentor berhasil diperbarui");
            await onSuccess();
            onClose();
        } catch (error) {
            toast.error("Gagal memperbarui tentor", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui data.",
            });
        } finally {
            setIsSubmitting(false);
        }
    });

    if (!open || !currentData) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                    <span className="h-8 rounded-full border-l-[6px] border-primary">{""}</span>
                    <h2 className="text-2xl font-medium text-foreground">Edit Tentor</h2>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="teacher-name" className="mb-2 block text-sm font-medium text-slate-700">
                            Nama Lengkap
                        </label>
                        <input
                            id="teacher-name"
                            type="text"
                            {...form.register("name")}
                            className="h-11 w-full rounded-xl border border-[#d9d9d9] px-3 text-sm outline-none focus:border-baseBlue"
                        />
                        {form.formState.errors.name ? (
                            <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>
                        ) : null}
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-2 rounded-full border border-primary px-4 py-3 text-base font-medium text-primary"
                            disabled={isSubmitting}
                        >
                            Batalkan
                            <IoMdCloseCircle size={19} />
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white disabled:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                            <IoCheckmarkCircle size={19} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
