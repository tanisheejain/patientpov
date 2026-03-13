// Temporary page: simulates Unity AR entry flow until Unity + Firebase integration is ready.
import Link from "next/link";
import { SectionCard } from "@/components/ui/SectionCard";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function ArEntryPage() {
  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-xl">
          <SectionCard
            title="AR Assessment Complete"
            description="Your claustrophobia assessment is ready."
          >
            <Link
              href="/intro?next=/report"
              className="group relative mt-1 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] px-6 text-base font-semibold text-black shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] saturate-125 brightness-[0.85] transition hover:brightness-[0.92] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
            >
              <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.10))] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative">View Report</span>
            </Link>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
