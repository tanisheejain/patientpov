"use client";

import { FLOW_COMPLETED_SESSION_KEY } from "@/components/flow/storage";
import { PatientHomeDashboard } from "@/components/dashboard/PatientHomeDashboard";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

export default function PatientPage() {
  const router = useRouter();
  const flowRaw = useSyncExternalStore(
    subscribeToStorage,
    getFlowSnapshot,
    getEmptySnapshot,
  );
  const flowCompleted = flowRaw === "1";

  useEffect(() => {
    if (!flowCompleted) {
      router.replace("/ar-entry");
    }
  }, [flowCompleted, router]);

  if (!flowCompleted) return null;

  return <PatientHomeDashboard />;
}

function subscribeToStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === FLOW_COMPLETED_SESSION_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getFlowSnapshot() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(FLOW_COMPLETED_SESSION_KEY) ?? "";
}

function getEmptySnapshot() {
  return "";
}
