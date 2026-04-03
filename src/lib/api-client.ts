export const API_CONFIG = {
    baseURL: '/api/backend',
};

type MockUserRole = "student" | "teacher";

type MockUser = {
    id: number;
    kode_user: string;
    role: MockUserRole;
    name: string;
    phone_number: string;
};

type MockStudent = {
    id: number;
    phone_number: string;
    user: MockUser;
};

type MockTeacher = {
    id: number;
    phone_number: string;
    user: MockUser;
    subject: {
        id: number;
        name: string;
    };
};

type MockSubSubject = {
    id: number;
    subject_id: number;
    name: string;
};

type MockSubject = {
    id: number;
    name: string;
    sub_subjects: MockSubSubject[];
};

type MockClassRoom = {
    id: number;
    name: string;
};

type MockSession = {
    id: number;
    start_time: string;
    end_time: string;
};

const MOCK_DB: {
    students: MockStudent[];
    teachers: MockTeacher[];
    subjects: MockSubject[];
    classRooms: MockClassRoom[];
    sessions: MockSession[];
} = {
    students: [
        {
            id: 1,
            phone_number: "081234560001",
            user: {
                id: 101,
                kode_user: "SCD-STU-001",
                role: "student",
                name: "Andi Pratama",
                phone_number: "081234560001",
            },
        },
        {
            id: 2,
            phone_number: "081234560002",
            user: {
                id: 102,
                kode_user: "SCD-STU-002",
                role: "student",
                name: "Bunga Lestari",
                phone_number: "081234560002",
            },
        },
    ],
    teachers: [
        {
            id: 1,
            phone_number: "081999100001",
            user: {
                id: 201,
                kode_user: "SCD-TCH-001",
                role: "teacher",
                name: "Raka Wijaya",
                phone_number: "081999100001",
            },
            subject: {
                id: 1,
                name: "Matematika",
            },
        },
        {
            id: 2,
            phone_number: "081999100002",
            user: {
                id: 202,
                kode_user: "SCD-TCH-002",
                role: "teacher",
                name: "Santi Nirmala",
                phone_number: "081999100002",
            },
            subject: {
                id: 2,
                name: "Bahasa Inggris",
            },
        },
    ],
    subjects: [
        {
            id: 1,
            name: "Matematika",
            sub_subjects: [
                { id: 11, subject_id: 1, name: "Aljabar" },
                { id: 12, subject_id: 1, name: "Geometri" },
            ],
        },
        {
            id: 2,
            name: "Bahasa Inggris",
            sub_subjects: [
                { id: 21, subject_id: 2, name: "Reading" },
                { id: 22, subject_id: 2, name: "Speaking" },
            ],
        },
    ],
    classRooms: [
        { id: 1, name: "A1" },
        { id: 2, name: "A2" },
    ],
    sessions: [
        { id: 1, start_time: "08:00", end_time: "09:30" },
        { id: 2, start_time: "09:30", end_time: "11:00" },
        { id: 3, start_time: "11:00", end_time: "12:30" },
    ],
};

function getNextId(values: number[]): number {
    return values.length > 0 ? Math.max(...values) + 1 : 1;
}

const hasConfiguredBackend = (): boolean => {
    return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
};

export const isFrontendOnlyMode = (): boolean => {
    return !hasConfiguredBackend();
};

function buildUrl(endpoint: string): string {
    const base = API_CONFIG.baseURL.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
}

function toSingularFirstSegment(endpoint: string): string {
    const parts = endpoint.split('?');
    const pathOnly = parts[0];
    const query = parts[1] ? `?${parts[1]}` : '';

    const segments = pathOnly.split('/');
    const firstIndex = segments.findIndex((segment) => segment.length > 0);

    if (firstIndex === -1) {
        return endpoint;
    }

    const firstSegment = segments[firstIndex];
    if (firstSegment.endsWith('s') && firstSegment.length > 1) {
        segments[firstIndex] = firstSegment.slice(0, -1);
        return `${segments.join('/')}${query}`;
    }

    return endpoint;
}

async function parseJsonResponse(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

export function validateAPIConfig(): { isValid: boolean; errors: string[] } {
    if (isFrontendOnlyMode()) {
        return {
            isValid: true,
            errors: [],
        };
    }

    const errors: string[] = [];

    if (!process.env.NEXT_PUBLIC_API_URL) {
        errors.push('NEXT_PUBLIC_API_URL is not set in environment variables');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

function extractBodyValue(options: RequestInit): Record<string, unknown> | null {
    if (!options.body) {
        return null;
    }

    if (typeof options.body === "string") {
        try {
            return JSON.parse(options.body);
        } catch {
            return null;
        }
    }

    return null;
}

function buildMockPaginatedResponse<T>(items: T[]): { data: { data: T[] } } {
    return {
        data: {
            data: items,
        },
    };
}

async function handleMockRequest<T>(endpoint: string, options: RequestInit): Promise<{ data: T | null; error: string | null }> {
    const method = (options.method || "GET").toUpperCase();
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const [pathOnly] = normalizedEndpoint.split("?");

    if (method === "GET" && pathOnly === "/admin/students") {
        return { data: buildMockPaginatedResponse(MOCK_DB.students) as T, error: null };
    }

    if (method === "GET" && pathOnly === "/admin/teachers") {
        return { data: buildMockPaginatedResponse(MOCK_DB.teachers) as T, error: null };
    }

    if (method === "GET" && pathOnly === "/subjects") {
        return { data: { data: MOCK_DB.subjects } as T, error: null };
    }

    if (method === "GET" && pathOnly === "/admin/class-rooms") {
        return { data: { data: MOCK_DB.classRooms } as T, error: null };
    }

    if (method === "GET" && pathOnly === "/sessions") {
        return { data: { data: MOCK_DB.sessions } as T, error: null };
    }

    if (method === "GET" && pathOnly.startsWith("/subjects/") && pathOnly.endsWith("/sub-subjects")) {
        const subjectId = Number(pathOnly.replace("/subjects/", "").replace("/sub-subjects", ""));
        const subject = MOCK_DB.subjects.find((item) => item.id === subjectId);
        return { data: { data: subject?.sub_subjects ?? [] } as T, error: null };
    }

    if (method === "GET" && pathOnly.startsWith("/admin/teachers/subject/")) {
        const subjectId = Number(pathOnly.replace("/admin/teachers/subject/", ""));
        const teachers = MOCK_DB.teachers.filter((teacher) => teacher.subject.id === subjectId);
        return { data: { data: teachers } as T, error: null };
    }

    if (method === "POST" && pathOnly === "/subjects") {
        const body = extractBodyValue(options);
        const name = typeof body?.name === "string" ? body.name.trim() : "";

        if (!name) {
            return { data: null, error: "Nama mapel wajib diisi." };
        }

        const newSubject: MockSubject = {
            id: getNextId(MOCK_DB.subjects.map((subject) => subject.id)),
            name,
            sub_subjects: [],
        };

        MOCK_DB.subjects = [...MOCK_DB.subjects, newSubject];
        return { data: { data: newSubject } as T, error: null };
    }

    if (method === "PUT" && pathOnly.startsWith("/subjects/")) {
        const subjectId = Number(pathOnly.replace("/subjects/", ""));
        const body = extractBodyValue(options);
        const name = typeof body?.name === "string" ? body.name.trim() : "";

        if (!subjectId || !name) {
            return { data: null, error: "Payload mapel tidak valid." };
        }

        let updatedSubject: MockSubject | null = null;
        MOCK_DB.subjects = MOCK_DB.subjects.map((subject) => {
            if (subject.id !== subjectId) {
                return subject;
            }

            updatedSubject = {
                ...subject,
                name,
            };

            return updatedSubject;
        });

        if (!updatedSubject) {
            return { data: null, error: "Mapel tidak ditemukan." };
        }

        return { data: { data: updatedSubject } as T, error: null };
    }

    if (method === "DELETE" && pathOnly.startsWith("/subjects/")) {
        const subjectId = Number(pathOnly.replace("/subjects/", ""));
        const beforeLength = MOCK_DB.subjects.length;
        MOCK_DB.subjects = MOCK_DB.subjects.filter((subject) => subject.id !== subjectId);

        if (beforeLength === MOCK_DB.subjects.length) {
            return { data: null, error: "Mapel tidak ditemukan." };
        }

        return { data: { message: "Mapel berhasil dihapus." } as T, error: null };
    }

    if (method === "POST" && pathOnly === "/sub-subjects") {
        const body = extractBodyValue(options);
        const subjectId = Number(body?.subject_id);
        const name = typeof body?.name === "string" ? body.name.trim() : "";
        const targetSubject = MOCK_DB.subjects.find((subject) => subject.id === subjectId);

        if (!targetSubject || !name) {
            return { data: null, error: "Payload sub mapel tidak valid." };
        }

        const allSubIds = MOCK_DB.subjects.flatMap((subject) => subject.sub_subjects.map((subSubject) => subSubject.id));
        const newSubSubject: MockSubSubject = {
            id: getNextId(allSubIds),
            subject_id: subjectId,
            name,
        };

        targetSubject.sub_subjects = [...targetSubject.sub_subjects, newSubSubject];
        return { data: { data: newSubSubject } as T, error: null };
    }

    if (method === "PUT" && pathOnly.startsWith("/sub-subjects/")) {
        const subSubjectId = Number(pathOnly.replace("/sub-subjects/", ""));
        const body = extractBodyValue(options);
        const name = typeof body?.name === "string" ? body.name.trim() : "";

        if (!subSubjectId || !name) {
            return { data: null, error: "Payload sub mapel tidak valid." };
        }

        let updated = false;
        MOCK_DB.subjects = MOCK_DB.subjects.map((subject) => ({
            ...subject,
            sub_subjects: subject.sub_subjects.map((subSubject) => {
                if (subSubject.id !== subSubjectId) {
                    return subSubject;
                }

                updated = true;
                return {
                    ...subSubject,
                    name,
                };
            }),
        }));

        if (!updated) {
            return { data: null, error: "Sub mapel tidak ditemukan." };
        }

        return { data: { message: "Sub mapel berhasil diperbarui." } as T, error: null };
    }

    if (method === "DELETE" && pathOnly.startsWith("/sub-subjects/")) {
        const subSubjectId = Number(pathOnly.replace("/sub-subjects/", ""));
        let deleted = false;

        MOCK_DB.subjects = MOCK_DB.subjects.map((subject) => {
            const beforeLength = subject.sub_subjects.length;
            const nextSubSubjects = subject.sub_subjects.filter((subSubject) => subSubject.id !== subSubjectId);
            if (beforeLength !== nextSubSubjects.length) {
                deleted = true;
            }

            return {
                ...subject,
                sub_subjects: nextSubSubjects,
            };
        });

        if (!deleted) {
            return { data: null, error: "Sub mapel tidak ditemukan." };
        }

        return { data: { message: "Sub mapel berhasil dihapus." } as T, error: null };
    }

    if (method === "POST" && pathOnly === "/admin/schedules") {
        return { data: { message: "Jadwal berhasil dibuat (simulasi frontend-only)." } as T, error: null };
    }

    if (method === "POST" && pathOnly === "/admin/import/students") {
        return { data: { message: "Import pelajar disimulasikan." } as T, error: null };
    }

    if (method === "POST" && pathOnly === "/admin/import/teachers") {
        return { data: { message: "Import tentor disimulasikan." } as T, error: null };
    }

    if (method === "PUT" && pathOnly.startsWith("/admin/users/")) {
        const userId = Number(pathOnly.replace("/admin/users/", ""));
        const body = extractBodyValue(options);
        const nextName = typeof body?.name === "string" ? body.name.trim() : "";

        if (!Number.isFinite(userId) || !nextName) {
            return { data: null, error: "Payload update pengguna tidak valid." };
        }

        let updated = false;

        MOCK_DB.students = MOCK_DB.students.map((student) => {
            if (student.user.id === userId) {
                updated = true;
                return {
                    ...student,
                    user: {
                        ...student.user,
                        name: nextName,
                    },
                };
            }

            return student;
        });

        MOCK_DB.teachers = MOCK_DB.teachers.map((teacher) => {
            if (teacher.user.id === userId) {
                updated = true;
                return {
                    ...teacher,
                    user: {
                        ...teacher.user,
                        name: nextName,
                    },
                };
            }

            return teacher;
        });

        if (!updated) {
            return { data: null, error: "Pengguna tidak ditemukan." };
        }

        return { data: { message: "Data pengguna berhasil diperbarui." } as T, error: null };
    }

    if (method === "DELETE" && pathOnly.startsWith("/admin/students/")) {
        const studentId = Number(pathOnly.replace("/admin/students/", ""));
        const beforeLength = MOCK_DB.students.length;
        MOCK_DB.students = MOCK_DB.students.filter((student) => student.id !== studentId);

        if (MOCK_DB.students.length === beforeLength) {
            return { data: null, error: "Pelajar tidak ditemukan." };
        }

        return { data: { message: "Pelajar berhasil dihapus." } as T, error: null };
    }

    if (method === "DELETE" && pathOnly.startsWith("/admin/teachers/")) {
        const teacherId = Number(pathOnly.replace("/admin/teachers/", ""));
        const beforeLength = MOCK_DB.teachers.length;
        MOCK_DB.teachers = MOCK_DB.teachers.filter((teacher) => teacher.id !== teacherId);

        if (MOCK_DB.teachers.length === beforeLength) {
            return { data: null, error: "Tentor tidak ditemukan." };
        }

        return { data: { message: "Tentor berhasil dihapus." } as T, error: null };
    }

    return {
        data: null,
        error: "Endpoint belum tersedia untuk mode frontend-only.",
    };
}

export async function apiRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
    if (isFrontendOnlyMode()) {
        return handleMockRequest<T>(endpoint, options);
    }

    const configValidation = validateAPIConfig();
    if (!configValidation.isValid) {
        console.error('API Configuration Error:', configValidation.errors);
        return {
            data: null,
            error: `API Configuration Error: ${configValidation.errors.join(', ')}`,
        };
    }

    try {
        const url = buildUrl(endpoint);

        console.log('API Request:', {
            url,
            method: options.method || 'GET',
            timestamp: new Date().toISOString(),
        });

        const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;

        const requestHeaders = {
            ...(isFormDataBody ? {} : { 'Content-Type': 'application/json' }),
            'Accept': 'application/json',
            ...options.headers,
        };

        let response = await fetch(url, {
            ...options,
            headers: requestHeaders,
        });

        console.log('API Response Status:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: {
                contentType: response.headers.get('content-type'),
            },
        });

        let result = await parseJsonResponse(response);

        const resultMessage = typeof result === 'object' && result !== null && 'message' in result && typeof (result as { message: unknown }).message === 'string'
            ? (result as { message: string }).message
            : '';

        const isRouteNotFound =
            response.status === 404 &&
            resultMessage.length > 0 &&
            resultMessage.toLowerCase().includes('route') &&
            resultMessage.toLowerCase().includes('could not be found');

        if (isRouteNotFound) {
            const fallbackEndpoint = toSingularFirstSegment(endpoint);

            if (fallbackEndpoint !== endpoint) {
                const fallbackUrl = buildUrl(fallbackEndpoint);

                console.warn('Retrying API request with singular endpoint:', {
                    originalEndpoint: endpoint,
                    fallbackEndpoint,
                    fallbackUrl,
                });

                response = await fetch(fallbackUrl, {
                    ...options,
                    headers: requestHeaders,
                });

                result = await parseJsonResponse(response);
            }
        }

        if (result === null) {
            return {
                data: null,
                error: 'Server returned invalid JSON response',
            };
        }

        console.log('API Response Data:', result);

        if (!response.ok) {
            const resultObj = typeof result === 'object' && result !== null ? result as Record<string, unknown> : {};
            const errorMessage = (typeof resultObj.error === 'string' ? resultObj.error : '') || 
                                (typeof resultObj.message === 'string' ? resultObj.message : '') || 
                                `HTTP ${response.status}: ${response.statusText}`;
            console.error('API Error Response:', errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }

        return { data: (result ?? null) as T | null, error: null };
    } catch (error: unknown) {
        let errorMessage = 'Tidak dapat terhubung ke server';

        const typedError = error instanceof Error ? error : null;

        if (typedError?.name === 'TypeError' && typedError.message.includes('fetch')) {
            errorMessage = 'Tidak dapat terhubung ke server. Pastikan Laravel backend berjalan di ' + API_CONFIG.baseURL;
        } else if (typedError?.message) {
            errorMessage = typedError.message;
        }

        return {
            data: null,
            error: errorMessage,
        };
    }
}
