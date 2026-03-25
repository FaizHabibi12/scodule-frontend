export type ScheduleTableRecord = {
    id: number;
    className: string;
    subjectName: string;
    teacherName: string;
    day: string;
    sessionTime: string;
    subSubjectName?: string;
    type?: 'regular' | 'private';
};

export type ScheduleFormData = {
    class_room_id: number;
    subject_id: number;
    teacher_id: number;
    sub_subject_id?: number | null;
    session_id: number;
    day: string;
};

export type ClassRoom = {
    id: number;
    name: string;
};

export type Subject = {
    id: number;
    name: string;
};

export type Teacher = {
    id: number;
    user?: {
        name: string;
        id: number;
    };
    subject_id: number;
};

export type SubSubject = {
    id: number;
    name: string;
    subject_id: number;
};

export type Session = {
    id: number;
    start_time: string;
    end_time: string;
};

export type ScheduleListResponse = {
    data: {
        data: ScheduleApiRecord[];
    };
};

export type ScheduleApiRecord = {
    id: number;
    day: string;
    class_room_id: number;
    subject_id: number;
    teacher_id: number;
    sub_subject_id?: number;
    session_id: number;
    classRoom?: {
        name: string;
    };
    teacher?: {
        user?: {
            name: string;
        };
    };
    subject?: {
        name: string;
    };
    subSubject?: {
        name: string;
    };
    session?: {
        start_time: string;
        end_time: string;
    };
};
