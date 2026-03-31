import z from "zod";

const subSubjectSchema = z.object({
    id: z.number().optional(),
    subject_id: z.number().optional(),
    name: z.string().min(1, "Nama sub-subject wajib diisi"),
});

export const createKelasSchema = z.object({
    name: z.string()
        .min(1, "Nama kelas wajib diisi")
        .max(100, "Nama kelas maksimal 100 karakter"),
    
    tipeKelas: z.enum(["Kelas Besar", "Kelas Kecil"], {
        error: "Tipe kelas harus dipilih"
    }),
    
    jumlahSiswa: z.number()
        .min(1, "Jumlah siswa minimal 1")
        .max(100, "Jumlah siswa maksimal 100")
        .int("Jumlah siswa harus berupa angka bulat"),
    
    subSubjects: z.array(subSubjectSchema).optional(),
});

export const updateKelasSchema = z.object({
    name: z.string()
        .min(1, "Nama kelas wajib diisi")
        .max(100, "Nama kelas maksimal 100 karakter"),
    
    tipeKelas: z.enum(["Kelas Besar", "Kelas Kecil"], {
        error: "Tipe kelas harus dipilih"
    }),
    
    jumlahSiswa: z.number()
        .min(1, "Jumlah siswa minimal 1")
        .max(100, "Jumlah siswa maksimal 100")
        .int("Jumlah siswa harus berupa angka bulat"),

    subSubjects: z.array(subSubjectSchema).optional(),
    subSubjectsToDelete: z.array(z.number()).optional(),
});

export type CreateKelasForm = z.infer<typeof createKelasSchema>;
export type UpdateKelasForm = z.infer<typeof updateKelasSchema>;