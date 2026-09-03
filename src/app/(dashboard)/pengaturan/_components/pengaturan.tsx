"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/src/lib/api-client";
import { AVATAR_FRAME_CLASS, AVATAR_OPTIONS, avatarUrl, useCurrentUser } from "@/src/components/common/user-profile";

type Tab = "profile" | "security";
type PasswordForm = { current_password: string; password: string; password_confirmation: string };

export default function PengaturanPage() {
    const router = useRouter();
    const { user, setUser } = useCurrentUser();
    const [tab, setTab] = useState<Tab>("profile");
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [profile, setProfile] = useState({ name: "", phone_number: "" });
    const [password, setPassword] = useState<PasswordForm>({ current_password: "", password: "", password_confirmation: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) setProfile({ name: user.name, phone_number: user.phone_number ?? "" });
    }, [user]);

    const currentAvatar = selectedAvatar ?? user?.profile_photo ?? AVATAR_OPTIONS[0];

    const saveProfile = async (event: FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        const { data, error } = await apiRequest<{ user?: typeof user }>("/me/profile", { method: "PATCH", body: JSON.stringify(profile) });
        setIsSaving(false);
        if (error) return toast.error("Gagal menyimpan profil", { description: error });
        if (data?.user) setUser(data.user);
        toast.success("Profil berhasil diperbarui");
    };

    const saveAvatar = async () => {
        if (!selectedAvatar) return;
        setIsSaving(true);
        const { data, error } = await apiRequest<{ data?: typeof user }>("/me/avatar", { method: "PATCH", body: JSON.stringify({ profile_photo: selectedAvatar }) });
        setIsSaving(false);
        if (error) return toast.error("Gagal menyimpan avatar", { description: error });
        if (user) setUser(data?.data ?? { ...user, profile_photo: selectedAvatar });
        setSelectedAvatar(null);
        toast.success("Avatar berhasil diperbarui");
    };

    const changePassword = async (event: FormEvent) => {
        event.preventDefault();
        if (password.password !== password.password_confirmation) return toast.error("Konfirmasi password tidak sama");
        setIsSaving(true);
        const { error } = await apiRequest("/me/password", { method: "PATCH", body: JSON.stringify(password) });
        setIsSaving(false);
        if (error) return toast.error("Gagal mengubah password", { description: error });
        toast.success("Password berhasil diubah, silakan login kembali");
        router.push("/login");
    };

    const fields: [keyof PasswordForm, string, string][] = [
        ["current_password", "Password Lama", "Masukkan password lama"],
        ["password", "Password Baru", "Masukkan password baru"],
        ["password_confirmation", "Konfirmasi Password Baru", "Ulangi password baru"],
    ];

    return <section className="min-h-[calc(100vh-7rem)] px-4 py-6 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
            <div className="mb-6"><p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">Akun</p><h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Pengaturan</h1></div>
            <div className="mb-5 inline-flex rounded-xl bg-slate-200 p-1">{(["profile", "security"] as const).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === item ? "bg-primary text-white " : "text-black hover:text-primary"}`}>{item === "profile" ? "Profile" : "Keamanan"}</button>)}</div>
            {tab === "profile" ? <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                <div className="rounded-2xl bg-white p-5 text-center shadow-sm"><div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-slate-50 p-2 sm:h-44 sm:w-44"><Image src={avatarUrl(currentAvatar)} alt={user?.name ?? "Profil"} width={176} height={176} className="h-full w-full rounded-full object-contain" /></div><h2 className="mt-4 text-lg font-semibold text-slate-900">{user?.name ?? "Memuat profil..."}</h2><p className="mt-1 capitalize text-slate-500">{user?.role ?? ""}</p><p className="mt-3 text-sm text-slate-400">{user?.kode_user ?? ""}</p></div>
                <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6"><form onSubmit={saveProfile} className="space-y-4"><div><h2 className="text-xl font-semibold text-slate-900">Profile</h2><p className="mt-1 text-sm text-slate-500">Kelola informasi akun Anda.</p></div><label className="block text-sm font-medium text-slate-700">Nama Lengkap<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-primary" /></label><label className="block text-sm font-medium text-slate-700">Nomor Telepon<input value={profile.phone_number} onChange={(event) => setProfile({ ...profile, phone_number: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-primary" placeholder="Contoh: 0822 5731 3006" /></label><button type="submit" disabled={isSaving} className="rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50">{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</button></form>
                    <div className="border-t border-slate-200 pt-5"><h2 className="text-lg font-semibold text-slate-900">Pilih Avatar</h2><div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">{AVATAR_OPTIONS.map((avatar) => <button key={avatar} type="button" onClick={() => setSelectedAvatar(avatar)} className={`flex aspect-square items-center justify-center rounded-xl border-2 p-1 transition ${currentAvatar === avatar ? "border-primary bg-orange-50" : "border-transparent hover:border-slate-200"}`}><Image src={`/${avatar}`} alt="Pilihan avatar" width={80} height={80} className={AVATAR_FRAME_CLASS} /></button>)}</div><button type="button" disabled={!selectedAvatar || isSaving} onClick={saveAvatar} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40">Simpan Avatar</button></div>
                </div>
            </div> : <form onSubmit={changePassword} className="grid gap-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1fr_300px]"><div className="space-y-4"><div><h2 className="text-xl font-semibold text-slate-900">Ubah Password</h2><p className="mt-1 text-sm text-slate-500">Perbarui password untuk menjaga keamanan akun.</p></div>{fields.map(([key, label, placeholder]) => <label key={key} className="block text-sm font-medium text-slate-700">{label}<input required minLength={6} type="password" value={password[key]} onChange={(event) => setPassword({ ...password, [key]: event.target.value })} placeholder={placeholder} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-primary" /></label>)}<button type="submit" disabled={isSaving} className="rounded-xl bg-primary px-5 py-3 font-medium text-white disabled:opacity-50">{isSaving ? "Memproses..." : "Update Password"}</button></div><aside className="rounded-2xl bg-primary p-5 text-white"><h2 className="text-xl font-semibold">Persyaratan Password</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm"><li>Minimal 6 karakter</li><li>Password baru harus berbeda</li><li>Konfirmasi password harus sama</li></ul></aside></form>}
        </div>
    </section>;
}
