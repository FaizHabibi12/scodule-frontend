
import Image from "next/image";
import Link from "next/link";
import Icon1 from "@/public/Icon1-error-pagination-not-found.svg";
import Icon2 from "@/public/Icon2-error-pagination-not-found.svg";
import Icon3 from "@/public/Icon3-error-pagination-not-found.svg";
import ImageStatus from "@/public/status-404.svg";
import { FaArrowRightLong } from "react-icons/fa6";

export default function ErrorPaginationNotFound() {
    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center h-screen gap-6">
                <div className="relative mb-10">
                    <Image src={ImageStatus} alt="Error Pagination" width={400} height={400}/>
                    <Image src={Icon1} alt="Error Pagination" width={70} height={70} className="absolute -top-6 right-0 transform -translate-x-10"/>
                    <Image src={Icon2} alt="Error Pagination" width={70} height={70} className="absolute top-[60%] left-0 transform -translate-x-1/2 -translate-y-1/2"/>
                    <Image src={Icon3} alt="Error Pagination" width={70} height={70} className="absolute bottom-0 right-0 transform translate-y-4 "/>
                </div>
                <div className="flex flex-col items-center gap-8 text-center">
                    <h1 className="text-5xl font-semibold text-[#18181B]">Halaman Tidak Ditemukan</h1>
                    <p className="text-[#71717B]">Harap kembali ke beranda kami, kami mohon maaf atas ketidaknyamanan ini.</p>
                    <Link href="/dashboard" className="bg-[#FF9B51] text-white flex items-center py-2 px-4 rounded-full text-base gap-1.5">
                        Kembali ke Beranda
                        <FaArrowRightLong width={24} height={24} />
                    </Link>
                </div>
            </div>
        </div>
    );
}