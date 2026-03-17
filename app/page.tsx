"use client";

import Link from "next/link";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function Home() {
  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-4xl">
          <header className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-black/60">
              Patient POV
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Choose your portal
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
              Patient and therapist journeys now live in separate spaces, with the
              same booking and dashboard behavior underneath.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <PortalCard
              eyebrow="Patient"
              title="Patient Dashboard"
              description="Assessment, report, booking flow, and patient home dashboard."
              href="/patient"
              actionLabel="Open patient portal"
            />
            <PortalCard
              eyebrow="Therapist"
              title="Therapist Dashboard"
              description="Therapist auth, calendar view, and patient session details."
              href="/therapist"
              actionLabel="Open therapist portal"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function PortalCard(props: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)] sm:p-7">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
        {props.eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{props.title}</h2>
      <p className="mt-3 text-sm leading-6 text-black/70">{props.description}</p>
      <Link
        href={props.href}
        className="group relative mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] px-6 text-base font-semibold text-black shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] saturate-125 brightness-[0.85] transition hover:brightness-[0.92] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
      >
        <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="relative">{props.actionLabel}</span>
      </Link>
    </section>
  );
}
