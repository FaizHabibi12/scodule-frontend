"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/src/lib/api-client";
import { AVATAR_FRAME_CLASS, AVATAR_OPTIONS, avatarUrl, useCurrentUser } from "@/src/components/common/user-profile";

export default function PengaturanPage() {
    const { user, setUser } = useCurrentUser();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const currentAvatar = selectedAvatar ?? user?.profile_photo ?? AVATAR_OPTIONS[0];

    const saveAvatar = async () => {
        if (!user || !selectedAvatar) return;
        setIsSaving(true);
        const { data, error } = await apiRequest<{ data?: typeof user }>("/me/avatar", {
            method: "PATCH",
            body: JSON.stringify({
                profile_photo: selectedAvatar,
            }),
        });

        if (error) {
            toast.error("Gagal menyimpan foto profil", { description: error });
        } else {
            setUser(data?.data ?? { ...user, profile_photo: selectedAvatar });
            setSelectedAvatar(null);
            toast.success("Foto profil berhasil diperbarui");
            window.location.reload();
        }
        setIsSaving(false);
    };

    return (
        <section className="min-h-[calc(100vh-7rem)] bg-[#eef0f0] px-6 py-8 md:px-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">Akun</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pengaturan Profil</h1>
                    <p className="mt-2 text-slate-500">Kelola informasi profil dan avatar akun Anda.</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-slate-50 p-2">
                            <Image src={avatarUrl(currentAvatar)} alt={user?.name ?? "Profil"} width={176} height={176} className="h-full w-full rounded-full object-contain" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-slate-900">{user?.name ?? "Memuat profil..."}</h2>
                        <p className="mt-1 capitalize text-slate-500">{user?.role ?? ""}</p>
                        <p className="mt-4 text-sm text-slate-400">{user?.kode_user ?? ""}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Pilih Avatar</h2>
                        <p className="mt-1 text-sm text-slate-500">Gunakan salah satu avatar yang tersedia.</p>
                        <div className="mt-6 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {AVATAR_OPTIONS.map((avatar) => (
                                <button key={avatar} type="button" onClick={() => setSelectedAvatar(avatar)} className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 p-2 transition ${currentAvatar === avatar ? "border-primary bg-orange-50" : "border-transparent hover:border-slate-200"}`}>
                                    <Image src={`/${avatar}`} alt={`Avatar ${avatar.split("/")[1].split(".")[0]}`} width={80} height={80} className={AVATAR_FRAME_CLASS} />
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button type="button" disabled={!selectedAvatar || isSaving} onClick={saveAvatar} className="rounded-xl bg-primary px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">
                                {isSaving ? "Menyimpan..." : "Simpan Avatar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}