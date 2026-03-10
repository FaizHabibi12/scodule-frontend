"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("Scodule Playground");
  const [intensity, setIntensity] = useState(50);
  const [showNotes, setShowNotes] = useState(true);

  const status = useMemo(() => {
    if (intensity < 30) return "Low";
    if (intensity < 70) return "Medium";
    return "High";
  }, [intensity]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <main className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Experimental Playground</h1>
          <p className="mt-2 text-sm text-slate-600">
            Try UI ideas quickly by changing inputs and previewing output.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-medium text-slate-900">Controls</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Experiment title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                placeholder="Type a title..."
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Intensity: {intensity}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-full"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(event) => setShowNotes(event.target.checked)}
                className="h-4 w-4"
              />
              Show notes
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-medium text-slate-900">Live Preview</h2>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Title</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{title || "Untitled Experiment"}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-1 text-base font-medium text-slate-900">{status}</p>
            </div>

            {showNotes ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Notes enabled. Use this area for temporary experiment annotations.
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
