"use client";

import Image from "next/image";
import { AVATAR_FRAME_CLASS, avatarUrl, useCurrentUser } from "./user-profile";

export default function HeaderContent() {
    const { user } = useCurrentUser();

    return (
        <div className="flex min-h-24 w-full items-center justify-start bg-baseBlue py-4 pl-20 pr-4 sm:pr-6 md:h-28.75 md:pr-8 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <Image src={avatarUrl(user?.profile_photo)} alt={user?.name ?? "Profil"} width={64} height={64} className={`${AVATAR_FRAME_CLASS} h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20`} />
                <div className="flex min-w-0 flex-col text-white leading-tight">
                    <h3 className="truncate text-lg font-bold sm:text-2xl md:text-[32px]">Halo, {user?.name ?? "Pengguna"}!</h3>
                    <span className="text-xs capitalize sm:text-base">{user?.role ?? ""}</span>
                </div>
            </div>
        </div>
    )
}