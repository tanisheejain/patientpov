"use client";

import {
  THERAPIST_AUTH_STORAGE_KEY,
  getStoredTherapistAuth,
} from "@/components/auth/therapistAuthStorage";
import {
  type AppointmentRecord,
  listAppointments,
  subscribeAppointments,
} from "@/components/flow/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function TherapistProfilePage() {
  const router = useRouter();
  const authRaw = useSyncExternalStore(
    subscribeToTherapistAuth,
    getClientAuthSnapshot,
    getServerAuthSnapshot,
  );
  const therapist = authRaw ? getStoredTherapistAuth() : null;
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);

  useEffect(() => {
    if (!therapist) {
      router.replace("/therapist/auth?intro=1");
      return;
    }

    let active = true;
    listAppointments()
      .then((rows) => {
        if (active) setAppointments(rows);
      })
      .catch((error) => {
        console.error("Could not load appointments", error);
      });

    const unsubscribe = subscribeAppointments(
      (rows) => setAppointments(rows),
      (error) => console.error("Could not subscribe to appointments", error),
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router, therapist]);

  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const upcomingSessions = useMemo(
    () =>
      appointments
        .filter((session) => session.dateISO >= todayKey)
        .sort(compareAppointmentDateTime),
    [appointments, todayKey],
  );
  const pastSessions = useMemo(
    () =>
      appointments
        .filter((session) => session.dateISO < todayKey)
        .sort((a, b) => compareAppointmentDateTime(b, a)),
    [appointments, todayKey],
  );
  const patientHistory = useMemo(() => {
    const grouped = new Map<
      string,
      {
        patientId: string;
        patientName: string;
        patientEmail: string;
        sessions: AppointmentRecord[];
      }
    >();

    for (const session of pastSessions) {
      const existing = grouped.get(session.patientId);
      if (existing) {
        existing.sessions.push(session);
        continue;
      }

      grouped.set(session.patientId, {
        patientId: session.patientId,
        patientName: session.patientName,
        patientEmail: session.patientEmail,
        sessions: [session],
      });
    }

    return [...grouped.values()].sort(
      (a, b) =>
        compareAppointmentDateTime(b.sessions[0]!, a.sessions[0]!) ||
        a.patientName.localeCompare(b.patientName),
    );
  }, [pastSessions]);
  const nextSession = upcomingSessions[0] ?? null;
  const currentMonthCount = useMemo(() => {
    const monthPrefix = todayKey.slice(0, 7);
    return appointments.filter((session) => session.dateISO.startsWith(monthPrefix))
      .length;
  }, [appointments, todayKey]);
  const activePatientCount = useMemo(
    () => new Set(upcomingSessions.map((session) => session.patientId)).size,
    [upcomingSessions],
  );

  if (!therapist) {
    return (
      <div className={PAGE_BG}>
        <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
          <div className="w-full max-w-xl rounded-3xl border border-black/10 bg-white/95 px-6 py-8 text-center shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
            <div className="text-lg font-semibold">Checking therapist access…</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-4xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <Link
                href="/therapist"
                className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/75 transition hover:bg-black/[0.02]"
              >
                Back to dashboard
              </Link>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Therapist Profile
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                A dedicated view for therapist details, schedule snapshot, and patient history.
              </p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white/90 px-5 py-4 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                Logged in
              </div>
              <div className="mt-2 text-lg font-semibold">{therapist.name}</div>
              <div className="mt-1 text-sm text-black/60">{therapist.email}</div>
            </div>
          </header>

          <section className="mt-8 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Sessions this month" value={String(currentMonthCount)} />
              <MetricCard label="Upcoming patients" value={String(activePatientCount)} />
              <MetricCard
                label="Past patients"
                value={String(new Set(pastSessions.map((session) => session.patientId)).size)}
              />
              <MetricCard
                label="Primary mode"
                value={appointments[0]?.mode ?? "Online"}
              />
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Profile Details</h2>
                <div className="text-xs text-black/50">Therapist-facing</div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard label="Name" value={therapist.name} />
                <InfoCard label="Email" value={therapist.email} />
                <InfoCard label="Focus area" value="Exposure therapy and anxiety care" />
                <InfoCard label="Availability" value="Weekdays, 10 AM to 6 PM" />
                <div className="sm:col-span-2">
                  <InfoCard
                    label="About"
                    value="Tracks session flow, upcoming bookings, and longitudinal patient context from the therapist dashboard."
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Calendar Snapshot</h2>
                <div className="text-sm text-black/60">{formatMonthLabel(todayKey)}</div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {nextSession ? (
                  <div className="rounded-2xl border border-black/10 bg-gradient-to-r from-[rgba(254,162,88,0.16)] to-[rgba(163,188,251,0.18)] px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
                      Next session
                    </div>
                    <div className="mt-2 text-base font-semibold">
                      {nextSession.patientName} on {formatDateLabel(nextSession.dateISO)}
                    </div>
                    <div className="mt-1 text-sm text-black/65">
                      {nextSession.time} · {nextSession.concern} · {nextSession.mode}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-4 text-sm text-black/65">
                    No upcoming sessions scheduled yet.
                  </div>
                )}

                <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
                    Upcoming dates
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...new Set(upcomingSessions.slice(0, 6).map((session) => session.dateISO))].map(
                      (dateKey) => (
                        <span
                          key={dateKey}
                          className="inline-flex items-center rounded-full bg-[#E9F8EC] px-3 py-1.5 text-xs font-semibold text-[#185C26] ring-1 ring-[#7ACB88]/40"
                        >
                          {formatDateLabel(dateKey)}
                        </span>
                      ),
                    )}
                    {upcomingSessions.length === 0 ? (
                      <span className="text-sm text-black/60">No upcoming dates yet.</span>
                    ) : null}
                  </div>
                </div>

                <Link
                  href="/therapist"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                >
                  Open live dashboard calendar
                </Link>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Past Patient History</h2>
              <div className="text-sm text-black/60">{patientHistory.length} patient records</div>
            </div>

            {patientHistory.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-5 text-sm text-black/65">
                Past sessions will appear here once appointments move into history.
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                {patientHistory.map((patient) => (
                  <details
                    key={patient.patientId}
                    className="group rounded-2xl border border-black/10 bg-white px-4 py-4"
                  >
                    <summary className="flex cursor-pointer list-none flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-base font-semibold">{patient.patientName}</div>
                        <div className="mt-1 text-sm text-black/60">{patient.patientEmail}</div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-black/60">
                        <span>{patient.sessions.length} past sessions</span>
                        <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold text-black/65 transition group-open:bg-[rgba(163,188,251,0.24)]">
                          View history
                        </span>
                      </div>
                    </summary>

                    <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4">
                      {patient.sessions.map((session) => (
                        <Link
                          key={session.id}
                          href={`/therapist/patients/${encodeURIComponent(session.patientId)}`}
                          className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3 transition hover:bg-black/[0.03] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB]/70"
                        >
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-sm font-semibold">
                              {formatDateLabel(session.dateISO)}
                            </span>
                            <span className="text-sm text-black/65">{session.time}</span>
                          </div>
                          <div className="mt-1 text-sm text-black/75">
                            {session.concern} · Session {session.sessionNumber}
                          </div>
                          <div className="mt-1 text-xs text-black/55">
                            {session.mode} · Patient profile
                          </div>
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function MetricCard(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
        {props.label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
    </div>
  );
}

function InfoCard(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
        {props.label}
      </div>
      <div className="mt-2 text-sm leading-6 text-black/80">{props.value}</div>
    </div>
  );
}

function subscribeToTherapistAuth(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === THERAPIST_AUTH_STORAGE_KEY) onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getClientAuthSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(THERAPIST_AUTH_STORAGE_KEY) ?? "";
}

function getServerAuthSnapshot() {
  return "";
}

function compareAppointmentDateTime(a: AppointmentRecord, b: AppointmentRecord) {
  return (
    a.dateISO.localeCompare(b.dateISO) ||
    toTimeValue(a.time) - toTimeValue(b.time) ||
    a.patientName.localeCompare(b.patientName)
  );
}

function toTimeValue(label: string) {
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  const hour12 = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  let hour24 = hour12 % 12;
  if (meridiem === "PM") hour24 += 12;

  return hour24 * 60 + minute;
}

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return dateKey;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthLabel(dateKey: string) {
  const [year, month] = dateKey.split("-").map(Number);
  if (!year || !month) return dateKey;

  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}
