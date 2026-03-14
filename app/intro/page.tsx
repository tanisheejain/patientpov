"use client";

import { INTRO_STORAGE_KEY } from "@/components/intro/introStorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, Suspense } from "react";

function IntroContent() {
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
      // Safety fallback in case iframe completion message is missed.
      finishIntro();
    }, 60_000);

    return () => window.clearTimeout(timeout);
  }, [finishIntro]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        typeof event.data === "object" &&
        event.data !== null &&
        "type" in event.data &&
        event.data.type === "solace-intro-finished"
      ) {
        finishIntro();
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [finishIntro]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <iframe
        src="/solace.html"
        title="Solace intro"
        className="h-full w-full border-0"
        allow="autoplay"
      />
      <button
        type="button"
        onClick={finishIntro}
        className="absolute right-4 top-4 inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white/85 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
      >
        Skip
      </button>
    </div>
  );
}

function normalizeNextPath(next: string | null) {
  if (!next) return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  return next;
}
export default function IntroPage() {
  return (
    <Suspense fallback={null}>
      <IntroContent />
    </Suspense>
  );
}