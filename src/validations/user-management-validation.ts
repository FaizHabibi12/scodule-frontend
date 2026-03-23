import z from "zod";

export const updateUserNameSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
});

export const deleteUserEntitySchema = z.object({
    id: z.number().positive("ID tidak valid"),
});

export type UpdateUserNameFormValues = z.infer<typeof updateUserNameSchema>;
export type DeleteUserEntityFormValues = z.infer<typeof deleteUserEntitySchema>;
