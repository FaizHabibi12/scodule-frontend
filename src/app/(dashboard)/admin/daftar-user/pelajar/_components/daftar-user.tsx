"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CiSearch } from "react-icons/ci";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { LuDownload, LuUpload } from "react-icons/lu";
import { DEFAULT_PAGE } from "@/src/constants/data-table-constant";

type UserRecord = {
  id: number;
  fullName: string;
  phoneNumber: string;
};

const USERS: UserRecord[] = [
  { id: 1, fullName: "Albert Flores", phoneNumber: "(319) 555-0115" },
  { id: 2, fullName: "Theresa Webb", phoneNumber: "(219) 555-0114" },
  { id: 3, fullName: "Savannah Nguyen", phoneNumber: "(207) 555-0119" },
  { id: 4, fullName: "Cody Fisher", phoneNumber: "(406) 555-0120" },
  { id: 5, fullName: "Eleanor Pena", phoneNumber: "(629) 555-0129" },
  { id: 6, fullName: "Kathryn Murphy", phoneNumber: "(480) 555-0103" },
  { id: 7, fullName: "Darlene Robertson", phoneNumber: "(302) 555-0107" },
  { id: 8, fullName: "Kristin Watson", phoneNumber: "(505) 555-0125" },
  { id: 9, fullName: "Jane Cooper", phoneNumber: "(252) 555-0118" },
  { id: 10, fullName: "Ronald Richards", phoneNumber: "(603) 555-0123" },
  { id: 11, fullName: "Devon Lane", phoneNumber: "(239) 555-0108" },
  { id: 12, fullName: "Bessie Cooper", phoneNumber: "(414) 555-0138" },
  { id: 13, fullName: "Floyd Miles", phoneNumber: "(808) 555-0111" },
  { id: 14, fullName: "Arlene McCoy", phoneNumber: "(702) 555-0122" },
  { id: 15, fullName: "Wade Warren", phoneNumber: "(684) 555-0102" },
];

const ITEMS_PER_PAGE = 6;

export default function DaftarUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return USERS;
    }

    return USERS.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(query) ||
        user.phoneNumber.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handleDummyAction = (label: string, fullName: string) => {
    toast.info(`${label} ${fullName}`, {
      description: "Backend belum tersedia. Ini masih mock action.",
    });
  };

  return (
    <section className="min-h-[calc(100vh-7rem)] bg-[#eef0f0] px-12 mt-6 pb-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-2xl font-semibold text-[#1e1e1e]">Daftar Pelajar</h5>
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

            <div className="flex items-center gap-3 self-end lg:self-auto">
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
                  <th className="w-32 px-3 py-4 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-[#25343F14]"}>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-600">
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </td>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-700">{user.fullName}</td>
                      <td className="border-r border-[#e4e4e4] px-3 py-4 text-sm text-slate-700">{user.phoneNumber}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDummyAction("Edit", user.fullName)}
                            className="rounded-full bg-[#28c98b] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#20b178]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDummyAction("Hapus", user.fullName)}
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
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                      Tidak ada user yang cocok dengan pencarian.
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
