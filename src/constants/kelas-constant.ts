import { CreateKelasForm, UpdateKelasForm } from "../validations/kelas-validation";
import { KelasFormState } from "../types/kelas";

export const INITIAL_CREATE_KELAS_FORM: CreateKelasForm = {
    name: "",
    tipeKelas: "Kelas Besar",
    jumlahSiswa: 1,
    subSubjects: [],
};

export const INITIAL_UPDATE_KELAS_FORM: UpdateKelasForm = {
    name: "",
    tipeKelas: "Kelas Besar",
    jumlahSiswa: 1,
    subSubjects: [],
    subSubjectsToDelete: [],
};

export const INITIAL_STATE_CREATE_KELAS: KelasFormState = {
    status: "idle",
    errors: {
        name: [],
        subSubjects: [],
        _form: [],
    },
};

export const INITIAL_STATE_UPDATE_KELAS: KelasFormState = {
    status: "idle",
    errors: {
        name: [],
        subSubjects: [],
        _form: [],
    },
};

export const HEADER_TABLE_Kelas = [
    { key: "no", label: "No" },
    { key: "name", label: "Nama Kelas" },
    { key: "subSubjectsCount", label: "Jumlah Sub Kelas" },
    { key: "action", label: "Action" },
];
