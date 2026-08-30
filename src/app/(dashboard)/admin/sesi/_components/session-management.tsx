"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/src/lib/api-client";

type Session = {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    note?: string | null;
    schedules_count?: number;
};

type FormState = Omit<Session, "id" | "schedules_count">;
const EMPTY_FORM: FormState = { name: "", start_time: "", end_time: "", note: "" };

function extractSessions(payload: any): Session[] {
    const data = payload?.data;
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.data) ? data.data : [];
}

export default function SessionManagement() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSessions = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await apiRequest("/sessions");
        if (error) {
            toast.error("Gagal memuat sesi", { description: error });
            setSessions([]);
        } else {
            setSessions(extractSessions(data));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        const { error } = await apiRequest(editingId ? `/admin/sessions/${editingId}` : "/admin/sessions", {
            method: editingId ? "PUT" : "POST",
            body: JSON.stringify(form),
        });

        if (error) {
            toast.error("Gagal menyimpan sesi", { description: error });
        } else {
            toast.success(editingId ? "Sesi berhasil diperbarui" : "Sesi berhasil dibuat");
            setForm(EMPTY_FORM);
            setEditingId(null);
            await fetchSessions();
        }
        setIsSaving(false);
    };

    const handleEdit = (session: Session) => {
        setEditingId(session.id);
        setForm({
            name: session.name,
            start_time: session.start_time.slice(0, 5),
            end_time: session.end_time.slice(0, 5),
            note: session.note ?? "",
        });
    };

    const handleDelete = async (session: Session) => {
        if (!window.confirm(`Hapus sesi ${session.name}?`)) return;
        const { error } = await apiRequest(`/admin/sessions/${session.id}`, { method: "DELETE" });
        if (error) {
            toast.error("Gagal menghapus sesi", { description: error });
        } else {
            toast.success("Sesi berhasil dihapus");
            await fetchSessions();
        }
    };

    return (
        <section className="w-full px-12 py-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-2xl font-semibold text-slate-900">Sesi Kelas</h1>
                <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
                    <form onSubmit={handleSubmit} className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold">{editingId ? "Edit Sesi" : "Tambah Sesi"}</h2>
                        <div className="space-y-4">
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama sesi" className="h-11 w-full rounded-xl border px-3" />
                            <label className="block text-sm text-slate-600">Waktu mulai<input required type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="mt-1 h-11 w-full rounded-xl border px-3 text-slate-900" /></label>
                            <label className="block text-sm text-slate-600">Waktu selesai<input required type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="mt-1 h-11 w-full rounded-xl border px-3 text-slate-900" /></label>
                            <textarea value={form.note ?? ""} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Catatan (opsional)" className="min-h-20 w-full rounded-xl border px-3 py-2" />
                            <div className="flex gap-2">
                                <button disabled={isSaving} className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white disabled:opacity-50">{isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Sesi"}</button>
                                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="rounded-xl border px-4">Batal</button>}
                            </div>
                        </div>
                    </form>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        {isLoading ? <p className="p-6 text-center text-slate-500">Memuat sesi...</p> : sessions.length === 0 ? <p className="p-6 text-center text-slate-500">Belum ada sesi.</p> : <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b text-left text-sm text-slate-500"><th className="p-3">Nama</th><th className="p-3">Waktu</th><th className="p-3">Jadwal</th><th className="p-3">Aksi</th></tr></thead><tbody>{sessions.map((session) => <tr key={session.id} className="border-b"><td className="p-3 font-medium">{session.name}</td><td className="p-3">{session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}</td><td className="p-3">{session.schedules_count ?? 0}</td><td className="flex gap-2 p-3"><button onClick={() => handleEdit(session)} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs text-white">Edit</button><button onClick={() => handleDelete(session)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white">Hapus</button></td></tr>)}</tbody></table></div>}
                    </div>
                </div>
            </div>
        </section>
    );
}
