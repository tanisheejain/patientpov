"use client";

import { CalendarPicker, toDateKey } from "@/components/booking/CalendarPicker";
import { FiltersRow, applyFilters, type BookingFilters } from "@/components/booking/FiltersRow";
import { TherapistCard } from "@/components/booking/TherapistCard";
import type { Therapist } from "@/components/booking/types";
import { SectionCard } from "@/components/ui/SectionCard";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function BookAppointmentPage() {
  const therapists: Therapist[] = [
    {
      id: "t-reco",
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
      id: "t-1",
      name: "Dr. Rohan Kapoor",
      specialization: "CBT • Phobias • Stress",
      yearsExperience: 7,
      bio: "Practical CBT frameworks with gradual exposure and breathing techniques.",
      sessionMode: "In-person",
      fee: 120,
      rating: 4.6,
      languages: ["English"],
    },
    {
      id: "t-2",
      name: "Dr. Neha Iyer",
      specialization: "Exposure therapy • Panic disorder",
      yearsExperience: 9,
      bio: "Specializes in fear conditioning and step-by-step exposure hierarchies.",
      sessionMode: "Online",
      fee: 160,
      rating: 4.7,
      languages: ["English", "Tamil"],
    },
    {
      id: "t-3",
      name: "Dr. Vikram Singh",
      specialization: "ACT • Anxiety • Mindfulness",
      yearsExperience: 6,
      bio: "Acceptance-based tools with gentle exposure and values-driven progress.",
      sessionMode: "In-person",
      fee: 95,
      rating: 4.5,
      languages: ["English", "Hindi", "Punjabi"],
    },
  ];

  const recommended = therapists[0]!;
  const listTherapists = therapists.slice(1);

  const availableLanguages = useMemo(() => {
    const s = new Set<string>();
    for (const t of listTherapists) for (const l of t.languages) s.add(l);
    return Array.from(s).sort();
  }, [listTherapists]);

  const [filters, setFilters] = useState<BookingFilters>({
    sessionMode: "Any",
    language: "Any",
    price: "Any",
  });

  const filteredTherapists = useMemo(
    () => applyFilters(listTherapists, filters),
    [listTherapists, filters],
  );

  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(
    null,
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

  const slots = useMemo(() => ["10:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"], []);

  const canBook = Boolean(selectedTherapist && selectedDate && selectedTime);

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
                therapist={recommended}
                highlighted
                actionLabel="Book with this Therapist"
                onAction={() => {
                  setSelectedTherapistId(recommended.id);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              />
            </SectionCard>

            <SectionCard title="Therapists">
              <FiltersRow
                filters={filters}
                onChange={setFilters}
                availableLanguages={availableLanguages}
              />

              <div className="mt-5 grid grid-cols-1 gap-4">
                {filteredTherapists.length ? (
                  filteredTherapists.map((t) => (
                    <TherapistCard
                      key={t.id}
                      therapist={t}
                      actionLabel={
                        selectedTherapistId === t.id ? "Selected" : "Select Therapist"
                      }
                      onAction={() => {
                        setSelectedTherapistId(t.id);
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/70">
                    No therapists match these filters.
                  </div>
                )}
              </div>
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
                  value={filters.language === "Any" ? "Any" : filters.language}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                >
                  Back to Report
                </Link>

                <button
                  type="button"
                  disabled={!canBook}
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

