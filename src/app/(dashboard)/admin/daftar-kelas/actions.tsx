"use server";

import { createKelasSchema, updateKelasSchema } from "@/src/validations/kelas-validation";
import { KelasFormState } from "@/src/types/kelas";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function requestHeaders(): Promise<HeadersInit> {
    const token = (await cookies()).get("auth_token")?.value;

    return {
        "Accept": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
    };
}

async function readResponse(response: Response): Promise<Record<string, any>> {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        return { message: `Backend mengembalikan response ${response.status} yang bukan JSON.` };
    }

    return (await response.json()) as Record<string, any>;
}

export async function createKelas(prevState: KelasFormState, formData: FormData): Promise<KelasFormState> {
    const name = formData.get("name");
    const tipeKelas = formData.get("tipe_kelas");
    const jumlahSiswaRaw = formData.get("jumlah_siswa");
    const subSubjectsJson = formData.get("subSubjects");

    let subSubjects = [];
    if (subSubjectsJson && typeof subSubjectsJson === "string") {
        try {
            subSubjects = JSON.parse(subSubjectsJson);
        } catch (e) {
            return {
                status: "error",
                errors: {
                    _form: ["Invalid sub-subjects data"],
                }
            };
        }
    }

    const jumlahSiswa = typeof jumlahSiswaRaw === "string" ? Number(jumlahSiswaRaw) : undefined;

    const validatedFields = createKelasSchema.safeParse({
        name,
        tipeKelas,
        jumlahSiswa,
        subSubjects,
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            }
        };
    }

    if (!API_BASE_URL) {
        return {
            status: "error",
            errors: { _form: ["NEXT_PUBLIC_API_URL belum diatur."] },
        };
    }

    try {
        const classResponse = await fetch(`${API_BASE_URL}/admin/classes`, {
            method: "POST",
            headers: await requestHeaders(),
            body: JSON.stringify({
                name: validatedFields.data.name,
            }),
        });

        const classData = await readResponse(classResponse);

        if (!classResponse.ok) {
            return {
                status: "error",
                errors: {
                    _form: [classData.error || classData.message || "Failed to create classroom"],
                }
            };
        }

        return {
            status: "success",
        };
    } catch (error: any) {
        return {
            status: "error",
            errors: {
                _form: [error.message || "An unexpected error occurred"],
            }
        };
    }
}

export async function updateKelas(prevState: KelasFormState, formData: FormData): Promise<KelasFormState> {
    const id = formData.get("id");
    const name = formData.get("name");
    const subSubjectsJson = formData.get("subSubjects");
    const subSubjectsToDeleteJson = formData.get("subSubjectsToDelete");

    let subSubjects = [];
    if (subSubjectsJson && typeof subSubjectsJson === "string") {
        try {
            subSubjects = JSON.parse(subSubjectsJson);
        } catch (e) {
            return {
                status: "error",
                errors: {
                    _form: ["Invalid sub-subjects data"],
                }
            };
        }
    }

    let subSubjectsToDelete = [];
    if (subSubjectsToDeleteJson && typeof subSubjectsToDeleteJson === "string") {
        try {
            subSubjectsToDelete = JSON.parse(subSubjectsToDeleteJson);
        } catch (e) {
            return {
                status: "error",
                errors: {
                    _form: ["Invalid deletion data"],
                }
            };
        }
    }

    const tipeKelas = formData.get("tipe_kelas");
    const jumlahSiswaRaw = formData.get("jumlah_siswa");
    const jumlahSiswa = typeof jumlahSiswaRaw === "string" ? Number(jumlahSiswaRaw) : undefined;

    const validatedFields = updateKelasSchema.safeParse({
        name,
        tipeKelas,
        jumlahSiswa,
        subSubjects,
        subSubjectsToDelete,
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            }
        };
    }

    if (!API_BASE_URL) {
        return {
            status: "error",
            errors: { _form: ["NEXT_PUBLIC_API_URL belum diatur."] },
        };
    }

    try {
        const classResponse = await fetch(`${API_BASE_URL}/admin/classes/${id}`, {
            method: "PUT",
            headers: await requestHeaders(),
            body: JSON.stringify({
                name: validatedFields.data.name,
            }),
        });

        const classData = await readResponse(classResponse);

        if (!classResponse.ok) {
            return {
                status: "error",
                errors: {
                    _form: [classData.error || classData.message || "Failed to update classroom"],
                }
            };
        }

        return {
            status: "success",
        };
    } catch (error: any) {
        return {
            status: "error",
            errors: {
                _form: [error.message || "An unexpected error occurred"],
            }
        };
    }
}

export async function deleteKelas(prevState: KelasFormState, formData: FormData): Promise<KelasFormState> {
    const id = formData.get("id");

    try {
        const response = await fetch(`${API_BASE_URL}/admin/classes/${id}`, {
            method: "DELETE",
            headers: await requestHeaders(),
        });

        const data = await readResponse(response);

        if (!response.ok) {
            return {
                status: "error",
                errors: {
                    _form: [data.error || data.message || "Failed to delete classroom"],
                }
            };
        }

        return {
            status: "success",
        };
    } catch (error: any) {
        return {
            status: "error",
            errors: {
                _form: [error.message || "An unexpected error occurred"],
            }
        };
    }
}
