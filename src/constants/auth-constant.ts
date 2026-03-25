export const INITAL_LOGIN_FORM = {
    kode_user: "",
    password: "",
};

export const INITAL_STATE_LOGIN_FORM = {
    status: 'idle',
    errors: {
        kode_user: [],
        password: [],
        _form: [],
    },
};


export const INITIAL_STATE_PROFILE = {
    id: '',
    name: '',
    profile_photo: '',
    role: '',
}

export const INITAL_CREATE_USER_FORM = {
    name: '',
    role: '',
    profile_photo: '',
    kode_user: '',
    password: '',
}

export const INITAL_STATE_CREATE_USER = {
    status: 'idle',
    errors: {
        name: [],
        role: [],
        profile_photo: [],
        kode_user: [],
        password: [],
        _form: [],
    }
};

export const INITAL_STATE_UPDATE_USER = {
    status: 'idle',
    errors: {
        name: [],
        role: [],
        profile_photo: [],
        _form: [],
    }
};

export const INITAL_UPDATE_USER_FORM = {
    name: '',
    role: '',
    profile_photo: '',
}

export const ROLE_LIST = [
    {
        value: 'admin',
        label: 'Admin',
    },
    {
        value: 'student',
        label: 'Student',
    },
    {
        value: 'teacher',
        label: 'Teacher',
    },
];

export const AVAILABILITY_LIST = [
    {
        value: 'true',
        label: 'available',
    },
    {
        value: 'false',
        label: 'Not available',
    },
];
