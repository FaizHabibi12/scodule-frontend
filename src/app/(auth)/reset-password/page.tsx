"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/src/lib/api-client";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState({ kode_user: "", password: "", password_confirmation: "" });
    const [isSaving, setIsSaving] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.password !== form.password_confirmation) {
            toast.error("Konfirmasi password tidak sama");
            return;
        }

        setIsSaving(true);
        const { error } = await apiRequest("/reset-password", {
            method: "POST",
            body: JSON.stringify(form),
        });
        setIsSaving(false);

        if (error) {
            toast.error("Reset password gagal", { description: error });
            return;
        }

        toast.success("Password berhasil direset");
        router.push("/login");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#eef0f0] px-6">
            <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">Keamanan akun</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reset Kata Sandi</h1>
                <p className="mt-2 text-sm text-slate-500">Masukkan kode user dan password baru Anda.</p>
                <div className="mt-6 space-y-4">
                    <input required value={form.kode_user} onChange={(e) => setForm({ ...form, kode_user: e.target.value })} placeholder="Kode User" className="h-12 w-full rounded-xl border bg-slate-50 px-4" />
                    <input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password baru" className="h-12 w-full rounded-xl border bg-slate-50 px-4" />
                    <input required minLength={6} type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} placeholder="Konfirmasi password baru" className="h-12 w-full rounded-xl border bg-slate-50 px-4" />
                    <button disabled={isSaving} className="h-12 w-full rounded-xl bg-primary font-semibold text-white disabled:opacity-50">{isSaving ? "Menyimpan..." : "Simpan Password"}</button>
                    <Link href="/login" className="block text-center text-sm text-slate-500 hover:text-slate-800">Kembali ke login</Link>
                </div>
            </form>
        </main>
    );
}
