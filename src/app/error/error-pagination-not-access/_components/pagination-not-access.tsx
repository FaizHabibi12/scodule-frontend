"use client"

import Icon1 from "@/public/icon/Icon1-error-pagination-not-access.svg";
import Icon2 from "@/public/icon/Icon2-error-pagination-not-access.svg";
import Icon3 from "@/public/icon/Icon3-error-pagination-not-access.svg";
import ImageStatus from "@/public/icon/status-403.svg";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { ImageWrapper } from "@/utils/image-wrapper";
import { useEffect, useState } from "react";


export default function ErrorPaginationNotAccess() {
    const [dashboardPath, setDashboardPath] = useState("/dashboard");

    useEffect(() => {
        const roleCookie = document.cookie
            .split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("user_role="))
            ?.split("=")[1];
        const role = roleCookie ? decodeURIComponent(roleCookie) : "";
        const path = role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/dashboard";

        setDashboardPath(path);
    }, []);

    return (
        <section>
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <div className="relative mb-10">
                    <ImageWrapper
                        src={ImageStatus}
                        alt="Status 404 - Halaman Tidak Ditemukan"
                        type="STATUS"
                        priority
                    />
                    <ImageWrapper
                        src={Icon1}
                        alt="Ikon dekoratif 1"
                        type="ICON"
                        className="absolute -top-6 right-0 transform -translate-x-10"
                    />
                    <ImageWrapper
                        src={Icon2}
                        alt="Ikon dekoratif 2"
                        type="ICON"
                        className="absolute top-[60%] left-0 transform -translate-x-1/2 -translate-y-1/2"
                    />
                    <ImageWrapper
                        src={Icon3}
                        alt="Ikon dekoratif 3"
                        type="ICON"
                        className="absolute bottom-0 right-0 transform translate-y-4"
                    />
                </div>

                <div className="flex flex-col items-center gap-8 text-center">
                    <h1 className="text-5xl font-semibold text-foreground">
                        Halaman Tidak Ditemukan
                    </h1>
                    <p className="text-muted">
                        Harap kembali ke beranda kami, kami mohon maaf atas ketidaknyamanan ini.
                    </p>
                    <Link
                        href={dashboardPath}
                        className="bg-primary text-white flex items-center py-2 px-4 rounded-full text-base gap-1.5">
                        Kembali ke Beranda
                        <FaArrowRightLong className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>

    );
}