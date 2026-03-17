"use client";

import { toDateKey } from "@/components/booking/CalendarPicker";
import {
  type AppointmentRecord,
  listAppointments,
  subscribeAppointments,
} from "@/components/flow/storage";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export function TherapistDashboard() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

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
  const otherAppointmentDateKeys = useMemo(
    () =>
      new Set(
        appointments.filter((a) => a.dateISO !== todayKey).map((a) => a.dateISO),
      ),
    [appointments, todayKey],
  );
  const appointmentsByDate = useMemo(() => {
    const grouped = new Map<string, AppointmentRecord[]>();

    for (const appointment of appointments) {
      const existing = grouped.get(appointment.dateISO) ?? [];
      existing.push(appointment);
      grouped.set(appointment.dateISO, existing);
    }

    for (const sessions of grouped.values()) {
      sessions.sort((a, b) => toTimeValue(a.time) - toTimeValue(b.time));
    }

    return grouped;
  }, [appointments]);
  const calendarMonth = useMemo(() => new Date(), []);
  const demoOtherAppointmentDateKeys = useMemo(
    () => getDemoOtherAppointmentDateKeys(calendarMonth, todayKey),
    [calendarMonth, todayKey],
  );
  const monthLabel = useMemo(
    () =>
      calendarMonth.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [calendarMonth],
  );
  const calendarDays = useMemo(() => buildMonthGrid(calendarMonth), [calendarMonth]);
  const selectedAppointments = selectedDateKey
    ? appointmentsByDate.get(selectedDateKey) ?? []
    : [];
  const selectedDateLabel = selectedDateKey
    ? formatDateLabel(selectedDateKey)
    : null;
  const selectedDateIsDemoOnly =
    !!selectedDateKey &&
    demoOtherAppointmentDateKeys.has(selectedDateKey) &&
    selectedAppointments.length === 0;

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Therapist Dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                View and manage today&apos;s patient schedule.
              </p>
            </div>
            <Link
              href="/therapist/profile"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
            >
              View profile
            </Link>
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

            <div className="mt-6 border-t border-black/10 pt-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Calendar</h3>
                <div className="text-sm text-black/60">{monthLabel}</div>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-2 text-xs font-medium text-black/50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="px-1 py-1 text-center">
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dateKey = toDateKey(day.date);
                  const isToday = dateKey === todayKey;
                  const hasRealAppointment = appointmentsByDate.has(dateKey);
                  const hasOtherAppointment =
                    otherAppointmentDateKeys.has(dateKey) ||
                    demoOtherAppointmentDateKeys.has(dateKey);
                  const isClickable = hasRealAppointment || demoOtherAppointmentDateKeys.has(dateKey);

                  return (
                    <button
                      key={day.key}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => setSelectedDateKey(dateKey)}
                      className={[
                        "relative flex h-12 items-center justify-center rounded-2xl border text-sm font-semibold transition",
                        day.inMonth
                          ? "border-black/10 bg-white text-black"
                          : "border-black/5 bg-white/50 text-black/25",
                        isToday
                          ? "border-transparent bg-gradient-to-br from-[rgba(254,162,88,0.22)] to-[rgba(163,188,251,0.24)] ring-2 ring-[#A3BCFB]/55"
                          : null,
                        hasOtherAppointment
                          ? "border-[#4FAE62] bg-[#DDF5E3] text-[#185C26] shadow-[inset_0_0_0_1px_rgba(79,174,98,0.18)]"
                          : null,
                        isClickable
                          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-18px_rgba(24,92,38,0.5)] focus:outline-none focus:ring-2 focus:ring-[#7ACB88]/70 focus:ring-offset-2"
                          : "cursor-default",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-label={
                        isClickable
                          ? `View appointments for ${dateKey}`
                          : `${dateKey} has no appointments`
                      }
                    >
                      {day.dayOfMonth}
                      {hasOtherAppointment ? (
                        <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#2F8F44]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-black/60">
                <div className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[linear-gradient(135deg,rgba(254,162,88,0.45),rgba(163,188,251,0.6))]" />
                  Today
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#E9F8EC] ring-1 ring-[#7ACB88]/50" />
                  Other appointments
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Modal
        open={selectedDateKey !== null}
        title={selectedDateLabel ? `Appointments for ${selectedDateLabel}` : undefined}
        onClose={() => setSelectedDateKey(null)}
      >
        {selectedDateIsDemoOnly ? (
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-4 text-sm leading-6 text-black/65">
            This day is marked as booked in demo mode, but there are no saved appointment records to show yet.
          </div>
        ) : selectedAppointments.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-4 text-sm leading-6 text-black/65">
            No appointment details found for this day.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {selectedAppointments.map((session) => (
              <Link
                key={session.id}
                href={`/therapist/patients/${encodeURIComponent(session.patientId)}`}
                onClick={() => setSelectedDateKey(null)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-4 transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB]/70"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-base font-semibold">{session.time}</span>
                  <span className="text-base">{session.patientName}</span>
                </div>
                <div className="mt-1 text-sm text-black/70">
                  {session.concern} · Session {session.sessionNumber}
                </div>
                <div className="mt-1 text-xs text-black/55">
                  {session.therapistName} · {session.mode}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

type CalendarDay = {
  key: string;
  date: Date;
  dayOfMonth: number;
  inMonth: boolean;
};

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

function buildMonthGrid(month: Date): CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const start = new Date(year, monthIndex, 1 - firstDay.getDay());

  const days: CalendarDay[] = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    days.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      dayOfMonth: date.getDate(),
      inMonth: date.getMonth() === monthIndex,
    });
  }

  return days;
}

function getDemoOtherAppointmentDateKeys(month: Date, todayKey: string) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const candidateDays = [10, 18, 27];

  return new Set(
    candidateDays
      .map((day) => toDateKey(new Date(year, monthIndex, day)))
      .filter((dateKey) => dateKey !== todayKey),
  );
}

function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return dateKey;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
