import Image from "next/image";

export default function HeaderContent() {
    return (
        <section>
            {/* Header ini untuk sementara waktu untuk desain dan nanti tinggal fetch */}
            <div className="w-full h-28.75 bg-baseBlue flex item-center justify-start px-8">
                <div className="flex items-center gap-6">
                    <Image src={"/foto-profile.jpg"} alt={"foto-profile-siswa"} width={80} height={80} className="rounded-full"/>
                    <div className="flex flex-col text-white leading-tight">
                        <h3 className="font-bold text-[32px]">Hola Dendih!</h3>
                        <span className="text-base">Mulai harimu dengan semangat! Rawr</span>
                    </div>
                </div>
            </div>
        </section>
    )
}