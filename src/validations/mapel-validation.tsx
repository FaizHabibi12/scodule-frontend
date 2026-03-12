import z from "zod";

export const subSubjectSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Sub-subject name is required"),
});

export const createMapelSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    subSubjects: z.array(subSubjectSchema).optional(),
});

export const updateMapelSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    subSubjects: z.array(subSubjectSchema).optional(),
    subSubjectsToDelete: z.array(z.number()).optional(),
});

export type SubSubjectForm = z.infer<typeof subSubjectSchema>;
export type CreateMapelForm = z.infer<typeof createMapelSchema>;
export type UpdateMapelForm = z.infer<typeof updateMapelSchema>;