'use server';

import { INITAL_STATE_LOGIN_FORM } from "@/src/constants/auth-constant";
import { AuthFormState } from "@/src/types/auth";
import { loginSchemaForm } from "@/src/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function login(prevState: AuthFormState, formData: FormData | null) {

    if (!formData) {
        return INITAL_STATE_LOGIN_FORM;
    }

    const validatedFields = loginSchemaForm.safeParse({
        kode_user: formData.get("kode_user"),
        password: formData.get("password"),
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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseUrl) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["NEXT_PUBLIC_API_URL belum diatur pada environment."],
            },
        };
    }

    const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, "");
    const configuredLoginPath = process.env.NEXT_PUBLIC_API_LOGIN_PATH || "/login";
    const normalizedLoginPath = configuredLoginPath.startsWith("/")
        ? configuredLoginPath
        : `/${configuredLoginPath}`;

    let response: Response;
    let result: any = null;

    try {
        response = await fetch(`${normalizedBaseUrl}${normalizedLoginPath}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(validatedFields.data),
            cache: "no-store",
        });

        if (response.status === 404 && normalizedLoginPath !== "/api/login") {
            response = await fetch(`${normalizedBaseUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(validatedFields.data),
                cache: "no-store",
            });
        }

        try {
            result = await response.json();
        } catch {
            result = null;
        }
    } catch {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["Tidak dapat terhubung ke server Laravel."],
            },
        };
    }

    if (!response.ok) {
        const apiErrors = result?.errors ?? {};
        const apiMessage = result?.message || "Kode User atau Kata Sandi tidak valid.";

        return {
            status: "error",
            errors: {
                kode_user: Array.isArray(apiErrors.kode_user) ? apiErrors.kode_user : [],
                password: Array.isArray(apiErrors.password) ? apiErrors.password : [],
                _form: [apiMessage],
            },
        };
    }

    const token = result?.token ?? result?.access_token ?? result?.data?.token;
    const profile = result?.user ?? result?.data?.user ?? null;

    if (!token) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["Respons login tidak mengandung token."],
            },
        };
    }

    const cookiesStore = await cookies();
    cookiesStore.set("auth_token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
    });

    if (profile) {
        cookiesStore.set("user_profile", JSON.stringify(profile), {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
        });

        if (typeof profile.role === "string" && profile.role.length > 0) {
            cookiesStore.set("user_role", profile.role, {
                httpOnly: false,
                path: "/",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30,
            });
        }
    }

    revalidatePath('/', 'layout');

    return {
        status: "success",
        errors: {
            kode_user: [],
            password: [],
            _form: [],
        },
    };
}

export async function logout() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("auth_token")?.value;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const normalizedBaseUrl = apiBaseUrl?.replace(/\/$/, "") || "";
    const configuredLogoutPath = process.env.NEXT_PUBLIC_API_LOGOUT_PATH || "/logout";
    const normalizedLogoutPath = configuredLogoutPath.startsWith("/")
        ? configuredLogoutPath
        : `/${configuredLogoutPath}`;

    let apiErrorMessage: string | null = null;

    if (token && normalizedBaseUrl) {
        try {
            let response = await fetch(`${normalizedBaseUrl}${normalizedLogoutPath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store",
            });

            if (response.status === 404 && normalizedLogoutPath !== "/api/logout") {
                response = await fetch(`${normalizedBaseUrl}/api/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    cache: "no-store",
                });
            }

            if (!response.ok && response.status !== 401) {
                let responseJson: any = null;
                try {
                    responseJson = await response.json();
                } catch {
                    responseJson = null;
                }

                apiErrorMessage = responseJson?.message || "Gagal logout dari server.";
            }
        } catch {
            apiErrorMessage = "Tidak dapat terhubung ke server Laravel saat logout.";
        }
    }

    cookiesStore.delete("auth_token");
    cookiesStore.delete("user_profile");
    cookiesStore.delete("user_role");

    revalidatePath('/', 'layout');

    if (apiErrorMessage) {
        return {
            success: false,
            message: apiErrorMessage,
        };
    }

    return {
        success: true,
        message: "Logout berhasil",
    };
}