import { CreateMapelForm, UpdateMapelForm } from "../validations/mapel-validation";
import { MapelFormState } from "../types/mapel";

export const INITIAL_CREATE_MAPEL_FORM: CreateMapelForm = {
    name: "",
    subSubjects: [],
};

export const INITIAL_UPDATE_MAPEL_FORM: UpdateMapelForm = {
    name: "",
    subSubjects: [],
    subSubjectsToDelete: [],
};

export const INITIAL_STATE_CREATE_MAPEL: MapelFormState = {
    status: "idle",
    errors: {
        name: [],
        subSubjects: [],
        _form: [],
    },
};

export const INITIAL_STATE_UPDATE_MAPEL: MapelFormState = {
    status: "idle",
    errors: {
        name: [],
        subSubjects: [],
        _form: [],
    },
};

export const HEADER_TABLE_MAPEL = [
    { key: "no", label: "No" },
    { key: "name", label: "Nama Mapel" },
    { key: "subSubjectsCount", label: "Jumlah Sub Mapel" },
    { key: "action", label: "Action" },
];
