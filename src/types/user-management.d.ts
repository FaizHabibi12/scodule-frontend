export type StudentTableRecord = {
    id: number;
    userId: number;
    kodeUser: string;
    role: string;
    fullName: string;
    phoneNumber: string;
};

export type TeacherTableRecord = {
    id: number;
    userId: number;
    kodeUser: string;
    role: string;
    fullName: string;
    phoneNumber: string;
    expertise: string;
};

export type ApiStudent = {
    id: number;
    phone_number?: string | null;
    user?: {
        id: number;
        kode_user?: string | null;
        role?: string | null;
        name?: string | null;
        phone_number?: string | null;
    } | null;
};

export type ApiTeacher = {
    id: number;
    phone_number?: string | null;
    user?: {
        id: number;
        kode_user?: string | null;
        role?: string | null;
        name?: string | null;
        phone_number?: string | null;
    } | null;
    subject?: {
        name?: string | null;
    } | null;
    teacher?: {
        phone_number?: string | null;
        subject?: {
            name?: string | null;
        } | null;
    } | null;
};

export type StudentListResponse = {
    data?: {
        data?: ApiStudent[];
    };
};

export type TeacherListResponse = {
    data?: {
        data?: ApiTeacher[];
    };
};

export type UpdateUserNameForm = {
    name: string;
};
