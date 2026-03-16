"use client";

import { CalendarPicker, toDateKey } from "@/components/booking/CalendarPicker";
import { TherapistCard } from "@/components/booking/TherapistCard";
import type { Therapist } from "@/components/booking/types";
import {
  FLOW_COMPLETED_SESSION_KEY,
  listAppointments,
  saveAppointment,
} from "@/components/flow/storage";
import { Modal } from "@/components/ui/Modal";
import { SectionCard } from "@/components/ui/SectionCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function BookAppointmentPage() {
  const concernLabel = "Claustrophobia";
  const therapists: Therapist[] = [
    {
      id: "t-1",
      name: "Dr. Ananya Mehra",
      specialization: "Exposure therapy • Anxiety disorders",
      yearsExperience: 11,
      bio: "Works with claustrophobia and panic responses using structured exposure plans.",
      sessionMode: "Online",
      fee: 140,
      rating: 4.8,
      languages: ["English", "Hindi"],
      recommendedReason:
        "Aligned with moderate claustrophobia profiles and guided exposure pacing.",
    },
    {
      name: "Dr. Neha Iyer",
      id: "t-2",
      specialization: "Exposure therapy • Panic disorder",
      yearsExperience: 9,
      bio: "Specializes in fear conditioning and step-by-step exposure hierarchies.",
      sessionMode: "Online",
      fee: 160,
      rating: 4.7,
      languages: ["English", "Tamil"],
      recommendedReason:
        "Strong fit for AR-triggered panic patterns with structured exposure hierarchies.",
    },
    {
      name: "Dr. Vikram Singh",
      id: "t-3",
      specialization: "ACT • Anxiety • Mindfulness",
      yearsExperience: 6,
      bio: "Acceptance-based tools with gentle exposure and values-driven progress.",
      sessionMode: "In-person",
      fee: 95,
      rating: 4.5,
      languages: ["English", "Hindi", "Punjabi"],
      recommendedReason:
        "Great for combining exposure with acceptance skills when avoidance is high.",
    },
  ];

  const [selectedTherapistId, setSelectedTherapistId] = useState<string>(
    therapists[0]!.id,
  );
  const selectedTherapist =
    therapists.find((t) => t.id === selectedTherapistId) ?? null;

  const month = useMemo(() => new Date(), []);

  const availability = useMemo(() => {
    // Dummy: 8 available days this month
    const year = month.getFullYear();
    const m = month.getMonth();
    const days = [3, 5, 8, 11, 15, 18, 22, 26];
    const dateKeys = new Set<string>();
    for (const d of days) dateKeys.add(toDateKey(new Date(year, m, d)));
    return dateKeys;
  }, [month]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authStep, setAuthStep] = useState<"auth" | "confirmed">("auth");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const router = useRouter();

  const slots = useMemo(() => ["10:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"], []);

  const canBook = Boolean(selectedTherapist && selectedDate && selectedTime);

  const persistAppointment = async (args: {
    patientEmail: string;
    fallbackName?: string;
  }) => {
    if (!selectedTherapist || !selectedDate || !selectedTime) return;

    const patientName = deriveNameFromEmail(args.patientEmail, args.fallbackName);
    const patientId = buildPatientId(args.patientEmail, patientName);
    const existing = await listAppointments();
    const sessionNumber =
      existing.filter(
        (a) => a.patientId === patientId && a.concern === concernLabel,
      ).length + 1;

    await saveAppointment({
      patientId,
      patientName,
      patientEmail: (args.patientEmail ?? "").trim().toLowerCase(),
      therapistId: selectedTherapist.id,
      therapistName: selectedTherapist.name,
      concern: concernLabel,
      sessionNumber,
      dateISO: toDateKey(selectedDate),
      time: selectedTime,
      mode: selectedTherapist.sessionMode,
    });
  };

  const completeFlowAndGoHome = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(FLOW_COMPLETED_SESSION_KEY, "1");
    }
    router.replace("/");
  };

  const submitAuthAndBook = async (args: {
    patientEmail: string;
    fallbackName?: string;
  }) => {
    setAuthError(null);
    setAuthStep("confirmed");
    void persistAppointment(args).catch(() => {
      console.warn("Could not save appointment; continuing in demo mode.");
    });
  };

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Book a Therapist Appointment
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
              Choose a therapist and a suitable time to begin your guided
              exposure therapy.
            </p>
          </header>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6">
            <SectionCard title="Recommended Therapist">
              <TherapistCard
                therapist={therapists.find((t) => t.id === selectedTherapistId) ?? therapists[0]!}
                highlighted
                actionLabel="Book with this Therapist"
                selector={
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">
                      Therapist
                    </span>
                    <select
                      className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                      value={selectedTherapistId}
                      onChange={(e) => {
                        setSelectedTherapistId(e.target.value);
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                    >
                      {therapists.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                }
                onAction={() => {
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              />
            </SectionCard>

            {selectedTherapist ? (
              <SectionCard title="Choose a Time">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <CalendarPicker
                      month={month}
                      selectedDate={selectedDate}
                      availableDateKeys={availability}
                      onSelectDate={(d) => {
                        setSelectedDate(d);
                        setSelectedTime(null);
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Available slots</div>
                      <div className="text-xs text-black/60">
                        {selectedDate ? toDateKey(selectedDate) : "Pick a date"}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {slots.map((s) => {
                        const active = selectedTime === s;
                        const disabled = !selectedDate;
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedTime(s)}
                            className={[
                              "h-11 rounded-2xl border text-sm font-semibold transition",
                              disabled
                                ? "cursor-not-allowed border-black/5 bg-white/60 text-black/40"
                                : "border-black/10 bg-white hover:bg-black/[0.02]",
                              active
                                ? "ring-2 ring-[#A3BCFB]/70 border-transparent bg-gradient-to-br from-[rgba(254,162,88,0.18)] to-[rgba(163,188,251,0.20)]"
                                : null,
                              "focus:outline-none focus:ring-2 focus:ring-[#A3BCFB]/70 focus:ring-offset-2",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionCard>
            ) : null}

            <SectionCard title="Booking Summary">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SummaryRow label="Therapist" value={selectedTherapist?.name ?? "—"} />
                <SummaryRow
                  label="Consultation mode"
                  value={selectedTherapist?.sessionMode ?? "—"}
                />
                <SummaryRow
                  label="Date"
                  value={selectedDate ? toDateKey(selectedDate) : "—"}
                />
                <SummaryRow label="Time" value={selectedTime ?? "—"} />
                <SummaryRow
                  label="Session fee"
                  value={selectedTherapist ? `$${selectedTherapist.fee}` : "—"}
                />
                <SummaryRow
                  label="Language"
                  value={selectedTherapist?.languages?.[0] ?? "—"}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/report"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                >
                  Back to Report
                </Link>

                <button
                  type="button"
                  disabled={!canBook}
                  onClick={() => {
                    if (!canBook) return;
                    setAuthMode("login");
                    setAuthStep("auth");
                    setAuthError(null);
                    setLoginEmail("");
                    setLoginPassword("");
                    setSignupName("");
                    setSignupEmail("");
                    setSignupPassword("");
                    setAuthOpen(true);
                  }}
                  className={[
                    "group relative inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-black transition sm:w-auto",
                    canBook
                      ? "bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] saturate-125 brightness-[0.85] shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] hover:brightness-[0.92]"
                      : "cursor-not-allowed border border-black/10 bg-white text-black/40",
                    "focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2",
                  ].join(" ")}
                >
                  {canBook ? (
                    <>
                      <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="relative">Confirm Appointment</span>
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>

      <Modal
        open={authOpen}
        title={
          authStep === "confirmed"
            ? "Appointment confirmed"
            : authMode === "login"
              ? "Log in to continue"
              : "Create an account"
        }
        onClose={() => {
          setAuthOpen(false);
          if (authStep === "confirmed") completeFlowAndGoHome();
        }}
      >
        {authStep === "confirmed" ? (
          <ConfirmationView
            name={deriveNameFromEmail(
              authMode === "login" ? loginEmail : signupEmail,
              signupName,
            )}
            date={selectedDate ? toDateKey(selectedDate) : "—"}
            time={selectedTime ?? "—"}
            onOkay={() => {
              setAuthOpen(false);
              completeFlowAndGoHome();
            }}
            onClose={() => {
              setAuthOpen(false);
              completeFlowAndGoHome();
            }}
          />
        ) : (
          <>
            <div className="flex gap-2 rounded-2xl border border-black/10 bg-white p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthStep("auth");
                  setAuthError(null);
                }}
                className={[
                  "h-10 flex-1 rounded-2xl text-sm font-semibold transition",
                  authMode === "login"
                    ? "bg-gradient-to-r from-[rgba(254,162,88,0.25)] to-[rgba(163,188,251,0.28)]"
                    : "hover:bg-black/[0.02]",
                ].join(" ")}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setAuthStep("auth");
                  setAuthError(null);
                }}
                className={[
                  "h-10 flex-1 rounded-2xl text-sm font-semibold transition",
                  authMode === "signup"
                    ? "bg-gradient-to-r from-[rgba(254,162,88,0.25)] to-[rgba(163,188,251,0.28)]"
                    : "hover:bg-black/[0.02]",
                ].join(" ")}
              >
                Sign up
              </button>
            </div>

            {authMode === "login" ? (
              <>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">
                      Email
                    </span>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">
                      Password
                    </span>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="group relative mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] px-6 py-4 text-base font-semibold text-black shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] saturate-125 brightness-[0.85] transition hover:brightness-[0.92] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                  onClick={() => submitAuthAndBook({ patientEmail: loginEmail })}
                >
                  <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">Log in</span>
                </button>
              </>
            ) : (
              <>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!signupEmail) setSignupEmail("apple.user@example.com");
                      }}
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB]/70"
                    >
                      Continue with Apple ID
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!signupEmail) setSignupEmail("google.user@gmail.com");
                      }}
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB]/70"
                    >
                      Continue with Google Account
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-black/10" />
                    <div className="text-xs font-medium text-black/50">or</div>
                    <div className="h-px flex-1 bg-black/10" />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-black/65">
                        Username
                      </span>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => {
                          setSignupName(e.target.value);
                        }}
                        placeholder="Your name"
                        className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-black/65">
                        Email
                      </span>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                        }}
                        placeholder="you@example.com"
                        className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-black/65">
                        Set password
                      </span>
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                        }}
                        placeholder="••••••••"
                        className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  className="group relative mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] px-6 py-4 text-base font-semibold text-black shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] saturate-125 brightness-[0.85] transition hover:brightness-[0.92] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                  onClick={() =>
                    submitAuthAndBook({
                      patientEmail: signupEmail,
                      fallbackName: signupName,
                    })
                  }
                >
                  <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">Sign up</span>
                </button>
              </>
            )}

            <div className="mt-3 text-xs leading-5 text-black/55">
              This is a placeholder auth step. Connect it to your auth provider
              when ready.
            </div>
            {authError ? (
              <div className="mt-2 rounded-xl border border-[#FEA258]/35 bg-[rgba(254,162,88,0.12)] px-3 py-2 text-xs leading-5 text-black/75">
                {authError}
              </div>
            ) : null}
          </>
        )}
      </Modal>
    </div>
  );
}

function SummaryRow(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
      <div className="text-xs font-semibold tracking-wide text-black/60">
        {props.label}
      </div>
      <div className="mt-1 text-sm font-semibold">{props.value}</div>
    </div>
  );
}

function ConfirmationView(props: {
  name: string;
  date: string;
  time: string;
  onOkay: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl border border-black/5 bg-gradient-to-r from-[rgba(254,162,88,0.14)] to-[rgba(163,188,251,0.16)] px-4 py-3">
        <div className="text-sm font-semibold">
          Hi {props.name}, your appointment for {props.date} at {props.time} is
          confirmed.
        </div>
        <div className="mt-1 text-xs leading-5 text-black/60">
          You can manage or reschedule from your dashboard.
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={props.onOkay}
          className="group relative inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] px-4 text-sm font-semibold text-black shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] saturate-125 brightness-[0.85] transition hover:brightness-[0.92] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
        >
          <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative">Okay</span>
        </button>
      </div>
    </div>
  );
}

function deriveNameFromEmail(email: string, fallbackName?: string) {
  const trimmedFallback = (fallbackName ?? "").trim();
  if (trimmedFallback) return toTitleCase(trimmedFallback);

  const raw = (email ?? "").trim();
  if (!raw) return "there";

  const local = raw.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z0-9._-]/g, "");
  const parts = cleaned.split(/[._-]+/).filter(Boolean);
  const base = parts.length ? parts[0]! : local;
  return toTitleCase(base);
}

function toTitleCase(s: string) {
  const t = s.trim();
  if (!t) return "there";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function buildPatientId(email: string, fallbackName: string) {
  const emailLocal = (email ?? "")
    .trim()
    .toLowerCase()
    .split("@")[0]
    ?.replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (emailLocal) return emailLocal;

  const name = (fallbackName ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (name) return name;

  return `patient-${Date.now()}`;
}
