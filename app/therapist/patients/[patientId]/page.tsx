"use client";

import {
  type AppointmentRecord,
  listAppointments,
  subscribeAppointments,
} from "@/components/flow/storage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function TherapistPatientProfilePage() {
  const params = useParams<{ patientId: string }>();
  const patientId = decodeURIComponent(params.patientId);

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

  const patientSessions = useMemo(
    () =>
      appointments
        .filter((a) => a.patientId === patientId)
        .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [appointments, patientId],
  );

  const latest = patientSessions[0];

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <header className="flex flex-col gap-3">
            <Link
              href="/therapist"
              className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/75 transition hover:bg-black/[0.02]"
            >
              Back to schedule
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Patient Profile
            </h1>
          </header>

          {!latest ? (
            <section className="mt-8 rounded-3xl border border-black/10 bg-white/95 p-6 text-sm text-black/65">
              Patient record not found.
            </section>
          ) : (
            <>
              <section className="mt-8 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Info label="Patient" value={latest.patientName} />
                  <Info label="Email" value={latest.patientEmail || "Not provided"} />
                  <Info label="Primary concern" value={latest.concern} />
                  <Info label="Latest session" value={`Session ${latest.sessionNumber}`} />
                </div>
              </section>

              <section className="mt-5 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
                <h2 className="text-lg font-semibold">Session History</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {patientSessions.map((session) => (
                    <div key={session.id} className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                      <div className="text-sm font-semibold">
                        {session.dateISO} at {session.time}
                      </div>
                      <div className="mt-1 text-sm text-black/70">
                        {session.concern} · Session {session.sessionNumber}
                      </div>
                      <div className="mt-1 text-xs text-black/55">
                        {session.therapistName} · {session.mode}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Info(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
      <div className="text-xs font-semibold tracking-wide text-black/60">{props.label}</div>
      <div className="mt-1 text-sm font-semibold">{props.value}</div>
    </div>
  );
}
