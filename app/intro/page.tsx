"use client";

import { INTRO_STORAGE_KEY } from "@/components/intro/introStorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function IntroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = normalizeNextPath(searchParams.get("next"));

  const finishIntro = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
    }
    router.replace(nextPath);
  }, [nextPath, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      // Safety: if video doesn't fire onEnded, still move on.
      finishIntro();
    }, 60_000);

    return () => window.clearTimeout(timeout);
  }, [finishIntro]);

  return (
    <div className={PAGE_BG}>
      <main className="flex min-h-screen flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <div className="flex items-center justify-between text-sm text-black/70">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1 text-xs font-medium tracking-wide">
              Solace
              <span className="h-1 w-1 rounded-full bg-black/30" />
              Intro
            </div>
            <button
              type="button"
              onClick={finishIntro}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
            >
              Skip
            </button>
          </div>

          <div className="mt-8 flex flex-1 items-center justify-center">
            <div className="w-full max-w-4xl rounded-3xl border border-black/5 bg-black/90 p-1 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]">
              <video
                src="/intro.mp4"
                autoPlay
                muted
                playsInline
                onEnded={finishIntro}
                onError={finishIntro}
                className="aspect-video w-full rounded-[1.35rem] object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-2xl text-center text-xs leading-5 text-black/60 sm:text-sm">
            Solace blends AR assessments, therapist sessions, and guided exposure
            to help you gradually feel safer in confined spaces.
          </div>
        </div>
      </main>
    </div>
  );
}

function normalizeNextPath(next: string | null) {
  if (!next) return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  return next;
}
