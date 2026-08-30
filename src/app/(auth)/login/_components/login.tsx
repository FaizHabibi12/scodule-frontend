"use client";

import { INITAL_STATE_LOGIN_FORM } from "@/src/constants/auth-constant";
import { login } from "../actions";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f2944d] text-base font-semibold text-white transition hover:bg-[#eb8738] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
            {pending ? "Memproses..." : "Lanjut"}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <IoIosArrowForward className="text-primary ml-0.5" />
            </span>
        </button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, INITAL_STATE_LOGIN_FORM);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const hasRedirected = useRef(false);
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (state?.status === "success" && !hasRedirected.current) {
            hasRedirected.current = true;
            toast.success("Login berhasil");
            redirectTimeoutRef.current = setTimeout(() => {
                router.push("/admin");
            }, 1000);
        }

        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, [router, state?.status]);

    return (
        <section
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/loginbg.jpg')" }}>
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 flex min-h-screen items-stretch">
                <section className="flex min-h-screen w-full md:w-1/2 items-center bg-white px-8 py-10 shadow-xl md:rounded-r-[28px] sm:px-12 sm:py-12 lg:px-16 lg:py-14">
                    <div className="mx-auto w-full max-w-lg">
                        <h1 className="text-5xl font-semibold tracking-tight text-[#f08434]">LOGO</h1>
                        <h2 className="mt-5 text-4xl font-semibold leading-tight text-slate-800">
                            Selamat Datang Kembali
                        </h2>

                        <form action={formAction} className="mt-10 space-y-5">
                            <div>
                                <label htmlFor="kode_user" className="mb-2 block text-base text-slate-600">
                                    Kode User
                                </label>
                                <input
                                    id="kode_user"
                                    name="kode_user"
                                    type="text"
                                    placeholder="Masukkan kode_user Anda"
                                    className="h-12 w-full rounded-xl border border-transparent bg-[#F4F4F5] px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f08434]" />
                                {state?.errors?.kode_user?.length ? (
                                    <p className="mt-2 text-sm text-red-500">{state.errors.kode_user[0]}</p>
                                ) : null}
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-base text-slate-600">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Masukkan kata sandi Anda"
                                        className="h-12 w-full rounded-xl border border-transparent bg-[#F4F4F5] px-4 pr-11 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f08434]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                    </button>
                                </div>
                                {state?.errors?.password?.length ? (
                                    <p className="mt-2 text-sm text-red-500">{state.errors.password[0]}</p>
                                ) : null}
                            </div>

                            {state?.errors?._form?.length ? (
                                <p className="text-sm text-red-500">{state.errors._form[0]}</p>
                            ) : null}

                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <Link href="/reset-password" className="hover:text-slate-700">
                                    Lupa Password? <span className="font-semibold">Reset Kata Sandi</span>
                                </Link>
                                <label className="inline-flex items-center gap-2">
                                    <input name="remember" type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                                    <span>Ingat Password?</span>
                                </label>
                            </div>

                            <SubmitButton />
                        </form>
                    </div>
                </section>
            </div>
        </section>
    );
}
