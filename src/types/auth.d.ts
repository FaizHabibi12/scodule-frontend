export type AuthFormState = {
    status?: string;
    errors?: {
        kode_user?: string[];
        password?: string[];
        name?: string[];
        role?: string[];
        profile_photo?: string[];
        _form?: string[];
    };
};

export type Profile = {
    id?: string;
    name?: string;
    role?: string;
    profile_photo?: string;
}