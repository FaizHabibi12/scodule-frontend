export type SubSubject = {
    id?: number;
    subject_id?: number;
    name: string;
    created_at?: string;
    updated_at?: string;
};

export type Subject = {
    id?: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    sub_subjects?: SubSubject[];
};

export type MapelFormState = {
    status?: string;
    errors?: {
        name?: string[];
        subSubjects?: string[];
        _form?: string[];
    };
};

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};