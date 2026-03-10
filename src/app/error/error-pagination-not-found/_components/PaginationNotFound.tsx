
import Image from "next/image";
import Link from "next/link";
import Icon1 from "@/public/Icon1-error-pagination-not-found.svg";
import Icon2 from "@/public/Icon2-error-pagination-not-found.svg";
import Icon3 from "@/public/Icon3-error-pagination-not-found.svg";
import ImageStatus from "@/public/status-404.svg";
import { FaArrowRightLong } from "react-icons/fa6";

const IMAGE_SIZE = {
    STATUS: { width: 400, height: 400 },
    ICON: { width: 70, height: 70 }
} as const;

export default function ErrorPaginationNotFound() {
    return (
        <section>
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <div className="relative mb-10">
                    <Image
                        src={ImageStatus}
                        alt="Status 404 - Halaman Tidak Ditemukan"
                        width={IMAGE_SIZE.STATUS.width}
                        height={IMAGE_SIZE.STATUS.height}
                        priority
                    />
                    <Image
                        src={Icon1}
                        alt="Ikon dekoratif 1"
                        width={IMAGE_SIZE.ICON.width}
                        height={IMAGE_SIZE.ICON.height}
                        className="absolute -top-6 right-0 transform -translate-x-10"
                    />
                    <Image
                        src={Icon2}
                        alt="Ikon dekoratif 2"
                        width={IMAGE_SIZE.ICON.width}
                        height={IMAGE_SIZE.ICON.height}
                        className="absolute top-[60%] left-0 transform -translate-x-1/2 -translate-y-1/2"
                    />
                    <Image
                        src={Icon3}
                        alt="Ikon dekoratif 3"
                        width={IMAGE_SIZE.ICON.width}
                        height={IMAGE_SIZE.ICON.height}
                        className="absolute bottom-0 right-0 transform translate-y-4"
                    />
                </div>
                <div className="flex flex-col items-center gap-8 text-center">
                    <h1 className="text-5xl font-semibold text-foreground">Halaman Tidak Ditemukan</h1>
                    <p className="text-muted">Harap kembali ke beranda kami, kami mohon maaf atas ketidaknyamanan ini.</p>
                    <Link href="/dashboard" className="bg-pri text-white flex items-center py-2 px-4 rounded-full text-base gap-1.5">
                        Kembali ke Beranda
                        <FaArrowRightLong className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>
    );
}