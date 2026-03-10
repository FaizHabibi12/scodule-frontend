import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/loginbg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex min-h-screen items-stretch">
        <section className="flex min-h-screen w-full md:w-1/2 items-center bg-[#efefef]/95 px-8 py-10 shadow-xl md:rounded-r-[28px] sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="text-5xl font-semibold tracking-tight text-[#f08434]">LOGO</h1>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-slate-800">
              Selamat Datang Kembali
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Login untuk mengakses. Belum punya akun?{" "}
              <Link href="#" className="font-semibold text-[#f08434] hover:underline">
                Register
              </Link>
            </p>

            <form className="mt-10 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-base text-slate-600">
                  Email / Username
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Placeholder"
                  className="h-12 w-full rounded-xl border border-transparent bg-[#e6e6e8] px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f08434]"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-base text-slate-600">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contoh: 3101934981050005"
                  className="h-12 w-full rounded-xl border border-transparent bg-[#e6e6e8] px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f08434]"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <button type="button" className="hover:text-slate-700">
                  Lupa Password? <span className="font-semibold">Reset Kata Sandi</span>
                </button>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                  <span>Ingat Password?</span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f2944d] text-base font-semibold text-white transition hover:bg-[#eb8738]"
              >
                Lanjut
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs">
                  {">"}
                </span>
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-sm text-slate-400">
              <span className="h-px grow bg-slate-300" />
              <span>Atau</span>
              <span className="h-px grow bg-slate-300" />
            </div>

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#f2944d] text-base font-medium text-[#ea7e2c] transition hover:bg-[#fff4ea]"
            >
              Masuk dengan Google
              <span className="text-lg font-semibold">G</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
