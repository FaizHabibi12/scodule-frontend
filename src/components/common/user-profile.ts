"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/src/lib/api-client";

export type CurrentUser = {
    id: number;
    name: string;
    role: string;
    kode_user: string;
    profile_photo?: string | null;
};

export const AVATAR_OPTIONS = [
    "avatars/1.png",
    "avatars/2.png",
    "avatars/3.png",
    "avatars/4.png",
    "avatars/5.png",
    "avatars/6.png",
] as const;

export const AVATAR_FRAME_CLASS = "h-20 w-20 shrink-0 rounded-full object-contain";

const avatarSet = new Set<string>(AVATAR_OPTIONS);

export function avatarUrl(profilePhoto?: string | null) {
    return profilePhoto && avatarSet.has(profilePhoto)
        ? `/${profilePhoto}`
        : `/${AVATAR_OPTIONS[0]}`;
}

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        let active = true;
        apiRequest<{ user?: CurrentUser }>("/me").then(({ data }) => {
            if (active) setUser(data?.user ?? null);
        });
        return () => { active = false; };
    }, []);

    return { user, setUser };
}
