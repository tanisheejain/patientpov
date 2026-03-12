import type { Therapist } from "@/components/booking/types";

export function TherapistCard(props: {
  therapist: Therapist;
  actionLabel: string;
  onAction: () => void;
  highlighted?: boolean;
  selector?: React.ReactNode;
}) {
  const { therapist } = props;
  const initials = therapist.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={[
        "rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)] sm:p-6",
        props.highlighted ? "ring-1 ring-[#A3BCFB]/60" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(254,162,88,0.25)] to-[rgba(163,188,251,0.28)] text-sm font-semibold text-black/80">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold">{therapist.name}</div>
            <div className="mt-0.5 text-sm text-black/70">
              {therapist.specialization}
            </div>
            <div className="mt-2 text-sm leading-6 text-black/75">
              {therapist.bio}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/65">
              <Pill>{therapist.yearsExperience}+ yrs</Pill>
              <Pill>{therapist.sessionMode}</Pill>
              <Pill>${therapist.fee}/session</Pill>
              <Pill>⭐ {therapist.rating.toFixed(1)}</Pill>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[220px] sm:items-stretch">
          {props.selector ? <div>{props.selector}</div> : null}
          <button
            type="button"
            onClick={props.onAction}
            className={[
              "relative inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-black transition",
              props.highlighted
                ? "bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] saturate-125 brightness-[0.88] shadow-[0_14px_28px_-22px_rgba(0,0,0,0.55)] hover:brightness-[0.95]"
                : "border border-black/10 bg-white hover:bg-black/[0.02]",
              "focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2",
            ].join(" ")}
          >
            {props.actionLabel}
          </button>
        </div>
      </div>

      {therapist.recommendedReason ? (
        <div className="mt-4 rounded-2xl border border-black/5 bg-gradient-to-r from-[rgba(254,162,88,0.14)] to-[rgba(163,188,251,0.16)] px-4 py-3">
          <div className="text-xs font-semibold tracking-wide text-black/70">
            Why recommended
          </div>
          <div className="mt-1 text-sm leading-6 text-black/80">
            {therapist.recommendedReason}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Pill(props: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
      {props.children}
    </span>
  );
}

