"use server";

import { createMapelSchema, updateMapelSchema } from "@/src/validations/mapel-validation";
import { MapelFormState } from "@/src/types/mapel";

export async function createMapel(prevState: MapelFormState, formData: FormData): Promise<MapelFormState> {
    const name = formData.get("name");
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

    const validatedFields = createMapelSchema.safeParse({
        name,
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

    try {
        const subjectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
            body: JSON.stringify({
                name: validatedFields.data.name,
            }),
        });

        const subjectData = await subjectResponse.json();

        if (!subjectResponse.ok) {
            return {
                status: "error",
                errors: {
                    _form: [subjectData.error || "Failed to create subject"],
                }
            };
        }

        if (validatedFields.data.subSubjects && validatedFields.data.subSubjects.length > 0) {
            const subSubjectPromises = validatedFields.data.subSubjects.map(async (subSubject) => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-subjects`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                    },
                    body: JSON.stringify({
                        subject_id: subjectData.data.id,
                        name: subSubject.name,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to create sub-subject");
                }

                return response.json();
            });

            await Promise.all(subSubjectPromises);
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

export async function updateMapel(prevState: MapelFormState, formData: FormData): Promise<MapelFormState> {
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

    const validatedFields = updateMapelSchema.safeParse({
        name,
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

    try {
        const subjectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
            body: JSON.stringify({
                name: validatedFields.data.name,
            }),
        });

        const subjectData = await subjectResponse.json();

        if (!subjectResponse.ok) {
            return {
                status: "error",
                errors: {
                    _form: [subjectData.error || "Failed to update subject"],
                }
            };
        }

        if (subSubjectsToDelete && subSubjectsToDelete.length > 0) {
            const deletePromises = subSubjectsToDelete.map(async (subSubjectId: any) => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-subjects/${subSubjectId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to delete sub-subject");
                }

                return response.json();
            });

            await Promise.all(deletePromises);
        }

        if (validatedFields.data.subSubjects && validatedFields.data.subSubjects.length > 0) {
            const subSubjectPromises = validatedFields.data.subSubjects.map(async (subSubject) => {
                if (subSubject.id) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-subjects/${subSubject.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                        body: JSON.stringify({
                            subject_id: id,
                            name: subSubject.name,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to update sub-subject");
                    }

                    return response.json();
                } else {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-subjects`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                        body: JSON.stringify({
                            subject_id: id,
                            name: subSubject.name,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to create sub-subject");
                    }

                    return response.json();
                }
            });

            await Promise.all(subSubjectPromises);
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

export async function deleteMapel(prevState: MapelFormState, formData: FormData): Promise<MapelFormState> {
    const id = formData.get("id");

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                errors: {
                    _form: [data.error || "Failed to delete subject"],
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
