"use client";

import { getSeverityStyles } from "@/components/assessment/severity";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionCard } from "@/components/ui/SectionCard";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

type Appointment = {
  therapistName: string;
  dateISO: string;
  time: string;
  location: string;
  mode: "In-person" | "Online";
};

export function PatientHomeDashboard() {
  const appointment: Appointment | null = {
    therapistName: "Dr. Vikram Singh",
    dateISO: nextWeekISO(),
    time: "3:00 PM",
    location: "Clinic • Bandra West, Mumbai",
    mode: "In-person",
  };

  const assessment = {
    severity: { label: "Moderate" as const, score01: 0.62 },
    triggers: ["Narrow corridors", "Limited movement", "Crowded elevator"],
  };

  const severityStyles = getSeverityStyles(assessment.severity.label);

  const stages = useMemo(
    () => ["Assessment", "Consultation", "Guided Exposure", "Recovery"] as const,
    [],
  );
  const currentStage: (typeof stages)[number] = "Consultation";

  const [notes, setNotes] = useState(
    "Noticing discomfort in elevators — want to practice breathing before stepping in.",
  );

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Home
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
              Your therapy dashboard at a glance.
            </p>
          </header>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6">
            <SectionCard title="Upcoming Appointment">
              {appointment ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Info label="Therapist" value={appointment.therapistName} />
                  <Info label="Mode" value={appointment.mode} />
                  <Info label="Date" value={appointment.dateISO} />
                  <Info label="Time" value={appointment.time} />
                  <div className="sm:col-span-2">
                    <Info label="Location" value={appointment.location} />
                  </div>
                </div>
              ) : (
                <div className="text-sm leading-6 text-black/70">
                  You haven't scheduled your first therapy session yet.
                </div>
              )}
            </SectionCard>

            <SectionCard title="Assessment Snapshot">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "h-10 w-10 rounded-2xl border",
                        severityStyles.iconBorder,
                        severityStyles.iconBg,
                      ].join(" ")}
                    />
                    <div>
                      <div className="text-sm text-black/70">Severity</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-semibold">
                          {assessment.severity.label}
                        </div>
                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-xs font-semibold",
                            severityStyles.badgeBg,
                            severityStyles.badgeText,
                          ].join(" ")}
                        >
                          {Math.round(assessment.severity.score01 * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/report-view"
                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                  >
                    View full report
                  </Link>
                </div>

                <ProgressBar
                  value01={assessment.severity.score01}
                  trackClassName="bg-black/5"
                  fillClassName={severityStyles.barFill}
                  ariaLabel="Assessment severity progress"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {assessment.triggers.map((t) => (
                    <div
                      key={t}
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-medium"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Therapy Journey">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  {stages.map((s, idx) => {
                    const active = s === currentStage;
                    const completed = stages.indexOf(currentStage) > idx;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-9 w-9 items-center justify-center rounded-2xl border text-sm font-semibold",
                            active
                              ? "border-transparent bg-gradient-to-br from-[rgba(254,162,88,0.22)] to-[rgba(163,188,251,0.24)] ring-2 ring-[#A3BCFB]/50"
                              : completed
                                ? "border-black/10 bg-white"
                                : "border-black/10 bg-white/70 text-black/50",
                          ].join(" ")}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={[
                              "text-sm font-semibold",
                              !active && !completed ? "text-black/55" : null,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {s}
                          </div>
                          {active ? (
                            <div className="text-xs leading-5 text-black/60">
                              Current stage
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="h-2 w-full rounded-full bg-black/5">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#FEA258,#A3BCFB)]"
                    style={{
                      width: `${
                        (stages.indexOf(currentStage) / (stages.length - 1)) * 100
                      }%`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Personal Notes">
              <div className="flex flex-col gap-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Write personal reflections or thoughts…"
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                />
                <div className="text-xs leading-5 text-black/55">
                  Saved locally for now (dummy).
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
      <div className="text-xs font-semibold tracking-wide text-black/60">
        {props.label}
      </div>
      <div className="mt-1 text-sm font-semibold">{props.value}</div>
    </div>
  );
}

function nextWeekISO() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
