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
  const [selectedVrLevel, setSelectedVrLevel] = useState<number | null>(null);
  const [vrNote, setVrNote] = useState("Sturggled in this section...");
  const [noteShared, setNoteShared] = useState(false);

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
  const displayName = latest ? mapPatientName(latest.patientName) : "";
  const isDelinaProfile = displayName.toLowerCase() === "delina tejwani";

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
                  <Info label="Patient" value={displayName} />
                  <Info label="Email" value={latest.patientEmail || "Not provided"} />
                  <Info label="Primary concern" value={latest.concern} />
                  <Info label="Latest session" value={`Session ${latest.sessionNumber}`} />
                </div>
              </section>

              {isDelinaProfile ? (
                <>
                  <section className="mt-5 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
                    <h2 className="text-lg font-semibold">AR Report</h2>
                    <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm leading-6 text-black/75">
                      Completed AR baseline exposure assessment. Mild-to-moderate discomfort noted
                      in enclosed simulated corridors; breathing regulation improved response time
                      across repeated prompts.
                    </div>
                  </section>

                  <section className="mt-5 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
                    <h2 className="text-lg font-semibold">VR</h2>
                    <div className="mt-4 flex flex-col gap-3">
                      <VrLevel
                        label="Level 1"
                        checked
                        active={selectedVrLevel === 1}
                        onClick={() => {
                          setSelectedVrLevel(1);
                          setNoteShared(false);
                        }}
                      />
                      <VrLevel label="Level 2" checked={false} />
                      <VrLevel label="Level 3" checked={false} />
                    </div>
                    {selectedVrLevel === 1 ? (
                      <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-4">
                        <div className="text-sm font-semibold text-black/80">Level 1 notes</div>
                        <textarea
                          value={vrNote}
                          onChange={(event) => {
                            setVrNote(event.target.value);
                            setNoteShared(false);
                          }}
                          className="mt-3 min-h-24 w-full rounded-xl border border-black/10 px-3 py-2 text-sm text-black/80 outline-none transition focus:border-[#A3BCFB] focus:ring-2 focus:ring-[#A3BCFB]/40"
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setNoteShared(true)}
                            disabled={!vrNote.trim()}
                            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/35"
                          >
                            Share notes with Delina
                          </button>
                          {noteShared ? (
                            <span className="text-xs font-semibold text-[#1E7D34]">
                              Notes shared with Delina.
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </section>
                </>
              ) : null}

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

function VrLevel(props: {
  label: string;
  checked: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
        props.active
          ? "border-[#A3BCFB] bg-[#F4F7FF] ring-2 ring-[#A3BCFB]/40"
          : "border-black/10 bg-white",
        props.onClick ? "cursor-pointer transition hover:bg-black/[0.02]" : "cursor-default",
      ].join(" ")}
    >
      <span className="text-sm font-semibold text-black/80">{props.label}</span>
      <span
        className={[
          "inline-flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-xs font-semibold",
          props.checked
            ? "border-[#2F8F44] bg-[#E9F8EC] text-[#185C26]"
            : "border-black/15 bg-white text-black/40",
        ].join(" ")}
      >
        {props.checked ? "✓" : ""}
      </span>
    </button>
  );
}

function mapPatientName(name: string) {
  const normalized = name.trim().toLowerCase();
  if (normalized === "there") return "delina tejwani";
  return name;
}
