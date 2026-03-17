"use client";

import { getStoredTherapistAuth } from "@/components/auth/therapistAuthStorage";
import { TherapistDashboard } from "@/components/dashboard/TherapistDashboard";
import { INTRO_STORAGE_KEY } from "@/components/intro/introStorage";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

export function TherapistAuthGate() {
  const router = useRouter();
  const introSeen = useSyncExternalStore(subscribeToStorage, getIntroSnapshot, getEmptySnapshot);
  const authRaw = useSyncExternalStore(subscribeToStorage, getAuthSnapshot, getEmptySnapshot);
  const isAuthorized = Boolean(authRaw && getStoredTherapistAuth());

  useEffect(() => {
    if (!introSeen) {
      router.replace("/intro?next=%2Ftherapist%2Fauth");
      return;
    }
    if (!isAuthorized) router.replace("/therapist/auth");
  }, [introSeen, isAuthorized, router]);

  if (!introSeen || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] px-4 py-10 text-black sm:px-6 sm:py-14">
        <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-black/10 bg-white/95 px-6 py-8 text-center shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)]">
            <div className="text-lg font-semibold">Checking therapist access…</div>
          </div>
        </div>
      </div>
    );
  }

  return <TherapistDashboard />;
}

function subscribeToStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === INTRO_STORAGE_KEY ||
      event.key === "patientpov_therapist_auth_v1"
    ) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getIntroSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(INTRO_STORAGE_KEY) ?? "";
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("patientpov_therapist_auth_v1") ?? "";
}

function getEmptySnapshot() {
  return "";
}
