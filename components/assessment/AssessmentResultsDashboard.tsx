import { SceneCard } from "@/components/assessment/SceneCard";
import { getSeverityStyles, type SeverityLabel } from "@/components/assessment/severity";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionCard } from "@/components/ui/SectionCard";

export type AssessmentResults = {
  severity: {
    label: SeverityLabel;
    score01: number;
    caption: string;
  };
  triggers: string[];
  scenes: Array<{
    title: string;
    emoji: string;
    interpretation: string;
  }>;
  recommendation: string;
};

export function AssessmentResultsDashboard(props: { assessment: AssessmentResults }) {
  const { assessment } = props;
  const severityStyles = getSeverityStyles(assessment.severity.label);

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black">
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] backdrop-blur sm:p-10">
            <header className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-medium tracking-wide">
                AR Assessment
                <span className="h-1 w-1 rounded-full bg-black/30" />
                Results
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Assessment Complete
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Here is a summary of how you responded during the claustrophobia
                assessment.
              </p>
            </header>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6">
              <SectionCard
                title="Severity Score"
                description="A quick view of overall discomfort."
              >
                <div className="flex flex-col gap-4">
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
                        <div className="text-sm text-black/70">
                          Severity level
                        </div>
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
                    <div className="text-sm text-black/70">
                      {assessment.severity.caption}
                    </div>
                  </div>

                  <ProgressBar
                    value01={assessment.severity.score01}
                    trackClassName="bg-black/5"
                    fillClassName={severityStyles.barFill}
                    ariaLabel="Severity progress"
                  />

                  <div className="flex justify-between text-xs text-black/55">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </div>
              </SectionCard>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <SectionCard
                  title="Main Triggers"
                  description="Common moments that increased discomfort."
                >
                  <ul className="mt-1 space-y-3">
                    {assessment.triggers.map((trigger) => (
                      <li
                        key={trigger}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[10px] font-bold text-black/70">
                          •
                        </span>
                        <span className="text-sm leading-6">{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard
                  title="Recommendation"
                  description="What to do next for meaningful progress."
                >
                  <div className="flex flex-col gap-4">
                    <p className="text-sm leading-6 text-black/80">
                      {assessment.recommendation}
                    </p>
                    <div className="rounded-2xl border border-black/5 bg-gradient-to-r from-[rgba(254,162,88,0.16)] to-[rgba(163,188,251,0.18)] px-4 py-3">
                      <div className="text-xs font-semibold tracking-wide text-black/70">
                        Suggested approach
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        Guided exposure + coping tools with a licensed therapist
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              <SectionCard
                title="Scene-wise Breakdown"
                description="Your selected responses per AR scene."
              >
                <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {assessment.scenes.map((scene) => (
                    <SceneCard
                      key={scene.title}
                      title={scene.title}
                      emoji={scene.emoji}
                      interpretation={scene.interpretation}
                    />
                  ))}
                </div>
              </SectionCard>

              <div className="pt-2">
                <a
                  href="#"
                  className="group relative flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] px-6 py-4 text-base font-semibold text-black shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] saturate-125 brightness-[0.85] transition hover:brightness-[0.92] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
                >
                  <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">Book a Therapist Appointment</span>
                </a>
                <p className="mt-3 text-center text-xs leading-5 text-black/55">
                  Booking is optional — you can also retake the assessment
                  anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

