import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/loginbg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex min-h-screen items-center p-4 sm:p-8">
        <section className="w-full max-w-[420px] rounded-[28px] bg-[#efefef]/95 px-7 py-8 shadow-xl sm:px-10 sm:py-10">
          <h1 className="text-4xl font-semibold tracking-tight text-[#f08434]">LOGO</h1>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-800">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Login untuk mengakses. Belum punya akun?{" "}
            <Link href="#" className="font-semibold text-[#f08434] hover:underline">
              Register
            </Link>
          </p>

          <form className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-600">
                Email / Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Placeholder"
                className="h-11 w-full rounded-xl border border-transparent bg-[#e6e6e8] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f08434]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-600">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Contoh: 3101934981050005"
                className="h-11 w-full rounded-xl border border-transparent bg-[#e6e6e8] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f08434]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
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
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f2944d] text-sm font-semibold text-white transition hover:bg-[#eb8738]"
            >
              Lanjut
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs">
                {">"}
              </span>
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px grow bg-slate-300" />
            <span>Atau</span>
            <span className="h-px grow bg-slate-300" />
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#f2944d] text-sm font-medium text-[#ea7e2c] transition hover:bg-[#fff4ea]"
          >
            Masuk dengan Google
            <span className="text-base font-semibold">G</span>
          </button>
        </section>
      </div>
    </div>
  );
}
