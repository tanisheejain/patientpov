"use client";

import { toDateKey } from "@/components/booking/CalendarPicker";
import {
  type AppointmentRecord,
  listAppointments,
  subscribeAppointments,
} from "@/components/flow/storage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export function TherapistDashboard() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);

  useEffect(() => {
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
  }, []);

  const todayKey = toDateKey(new Date());
  const todaysSessions = useMemo(
    () =>
      appointments
        .filter((a) => a.dateISO === todayKey)
        .sort((a, b) => toTimeValue(a.time) - toTimeValue(b.time)),
    [appointments, todayKey],
  );

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Therapist Dashboard
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
              View and manage today&apos;s patient schedule.
            </p>
          </header>

          <section className="mt-8 rounded-3xl border border-black/10 bg-white/95 p-5 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)] sm:mt-10 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Today&apos;s Sessions</h2>
              <div className="text-xs text-black/55">{todayKey}</div>
            </div>

            {todaysSessions.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-black/5 bg-white px-4 py-6 text-sm text-black/65">
                No sessions scheduled for today yet.
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {todaysSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/therapist/patients/${encodeURIComponent(session.patientId)}`}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-4 transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB]/70"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-base font-semibold">{session.time}</span>
                      <span className="text-base">{session.patientName}</span>
                    </div>
                    <div className="mt-1 text-sm text-black/70">
                      {session.concern} · Session {session.sessionNumber}
                    </div>
                    <div className="mt-1 text-xs text-black/55">{session.therapistName}</div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
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
