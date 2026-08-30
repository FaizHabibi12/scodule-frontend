"use client";

import Image from "next/image";
import { AVATAR_FRAME_CLASS, avatarUrl, useCurrentUser } from "./user-profile";

export default function HeaderContent() {
    const { user } = useCurrentUser();
    return (
        <section>
            {/* Header ini untuk sementara waktu untuk desain dan nanti tinggal fetch */}
            <div className="w-full h-28.75 bg-baseBlue flex item-center justify-start px-8">
                <div className="flex items-center gap-6">
                    <Image src={avatarUrl(user?.profile_photo)} alt={user?.name ?? "Profil"} width={80} height={80} className={`${AVATAR_FRAME_CLASS} h-20 w-20`} />
                    <div className="flex flex-col text-white leading-tight">
                        <h3 className="font-bold text-[32px]">Halo, {user?.name ?? "Pengguna"}!</h3>
                        <span className="text-base capitalize">{user?.role ?? ""}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}