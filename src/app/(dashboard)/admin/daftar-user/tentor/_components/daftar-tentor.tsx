"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CiSearch } from "react-icons/ci";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { LuDownload, LuUpload } from "react-icons/lu";
import { DEFAULT_PAGE } from "@/src/constants/data-table-constant";

type MentorRecord = {
  id: number;
  fullName: string;
  phoneNumber: string;
  expertise: string;
};

const MENTORS: MentorRecord[] = [
  { id: 1, fullName: "Albert Flores", phoneNumber: "(319) 555-0115", expertise: "Matematika" },
  { id: 2, fullName: "Theresa Webb", phoneNumber: "(219) 555-0114", expertise: "Fisika" },
  { id: 3, fullName: "Savannah Nguyen", phoneNumber: "(207) 555-0119", expertise: "Biologi" },
  { id: 4, fullName: "Cody Fisher", phoneNumber: "(406) 555-0120", expertise: "Kimia" },
  { id: 5, fullName: "Eleanor Pena", phoneNumber: "(629) 555-0129", expertise: "Bahasa Inggris" },
  { id: 6, fullName: "Kathryn Murphy", phoneNumber: "(480) 555-0103", expertise: "Informatika" },
  { id: 7, fullName: "Darlene Robertson", phoneNumber: "(302) 555-0107", expertise: "Matematika" },
  { id: 8, fullName: "Kristin Watson", phoneNumber: "(505) 555-0125", expertise: "Kimia" },
  { id: 9, fullName: "Jane Cooper", phoneNumber: "(252) 555-0118", expertise: "Biologi" },
  { id: 10, fullName: "Ronald Richards", phoneNumber: "(603) 555-0123", expertise: "Bahasa Inggris" },
  { id: 11, fullName: "Devon Lane", phoneNumber: "(239) 555-0108", expertise: "Informatika" },
  { id: 12, fullName: "Bessie Cooper", phoneNumber: "(414) 555-0138", expertise: "Fisika" },
  { id: 13, fullName: "Floyd Miles", phoneNumber: "(808) 555-0111", expertise: "Matematika" },
  { id: 14, fullName: "Arlene McCoy", phoneNumber: "(702) 555-0122", expertise: "Informatika" },
  { id: 15, fullName: "Wade Warren", phoneNumber: "(684) 555-0102", expertise: "Kimia" },
];

const ITEMS_PER_PAGE = 6;
const SKILL_OPTIONS = ["Semua Keahlian", "Matematika", "Fisika", "Biologi", "Kimia", "Bahasa Inggris", "Informatika"];

export default function DaftarTentorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(SKILL_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const filteredMentors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MENTORS.filter((mentor) => {
      const matchKeyword =
        !query ||
        mentor.fullName.toLowerCase().includes(query) ||
        mentor.phoneNumber.toLowerCase().includes(query) ||
        mentor.expertise.toLowerCase().includes(query);

      const matchSkill = selectedSkill === SKILL_OPTIONS[0] || mentor.expertise === selectedSkill;

      return matchKeyword && matchSkill;
    });
  }, [searchQuery, selectedSkill]);

  const totalPages = Math.max(1, Math.ceil(filteredMentors.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMentors = filteredMentors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSkillChange = (value: string) => {
    setSelectedSkill(value);
    setCurrentPage(1);
  };

  const handleDummyAction = (label: string, fullName: string) => {
    toast.info(`${label} ${fullName}`, {
      description: "Backend belum tersedia. Ini masih mock action.",
    });
  };

  return (
    <section className="min-h-[calc(100vh-7rem)] bg-[#eef0f0] px-12 mt-6 pb-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-2xl font-medium text-black">Daftar Tentor</h5>
        </div>

        <div className="rounded-3xl bg-white px-6 py-6 shadow-[0_12px_40px_rgba(37,52,63,0.08)]">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-95">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search Bar"
                className="h-12 w-full rounded-2xl bg-[#f3f1f1] px-5 pr-12 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <CiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400" />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <div className="relative">
                <select
                  title="Pilih keahlian"
                  value={selectedSkill}
                  onChange={(event) => handleSkillChange(event.target.value)}
                  className="h-11 min-w-32 appearance-none rounded-2xl bg-[#f3f1f1] px-4 pr-9 text-sm text-slate-400 outline-none"
                >
                  {SKILL_OPTIONS.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌄</span>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Import belum tersedia", { description: "Hubungkan ke backend saat endpoint sudah siap." })}
                className="flex h-11 items-center gap-2 rounded-2xl bg-[#f3f1f1] px-5 text-sm text-slate-400 transition hover:text-slate-600"
              >
                Import
                <LuUpload className="text-base" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("Export belum tersedia", { description: "Hubungkan ke backend saat endpoint sudah siap." })}
                className="flex h-11 items-center gap-2 rounded-2xl bg-[#f3f1f1] px-5 text-sm text-slate-400 transition hover:text-slate-600"
              >
                Export
                <LuDownload className="text-base" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-[#d9d9d9] bg-white">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-baseBlue text-white">
                  <th className="w-16 border-r border-white px-3 py-4 text-left text-sm font-medium">NO</th>
                  <th className="border-r border-white px-3 py-4 text-left text-sm font-medium">Nama Lengkap</th>
                  <th className="border-r border-white px-3 py-4 text-left text-sm font-medium">Nomor Telepon</th>
                  <th className="border-r border-white px-3 py-4 text-left text-sm font-medium">Keahlian</th>
                  <th className="w-32 px-3 py-4 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentMentors.length > 0 ? (
                  currentMentors.map((mentor, index) => (
                    <tr key={mentor.id} className={index % 2 === 0 ? "bg-white" : "bg-[#25343F14]"}>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-600">
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </td>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-700">{mentor.fullName}</td>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-700">{mentor.phoneNumber}</td>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-700">{mentor.expertise}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDummyAction("Edit", mentor.fullName)}
                            className="rounded-full bg-[#28c98b] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#20b178]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDummyAction("Hapus", mentor.fullName)}
                            className="rounded-full bg-[#f05b4f] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#db473d]"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      Tidak ada tentor yang cocok dengan filter saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex items-center justify-between px-2">
            <button
              type="button"
              title="Halaman sebelumnya"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-baseBlue text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IoChevronBackOutline className="text-xl" />
            </button>

            <div className="flex items-center gap-5 text-sm text-slate-400">
              {pages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                    currentPage === page
                      ? "border border-baseBlue text-baseBlue"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {String(page).padStart(2, "0")}
                </button>
              ))}
            </div>

            <button
              type="button"
              title="Halaman berikutnya"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-baseBlue text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IoChevronForwardOutline className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
