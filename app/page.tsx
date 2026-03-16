"use client";

import { FLOW_COMPLETED_SESSION_KEY } from "@/components/flow/storage";
import { PatientHomeDashboard } from "@/components/dashboard/PatientHomeDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const flowCompleted =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(FLOW_COMPLETED_SESSION_KEY) === "1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(FLOW_COMPLETED_SESSION_KEY) !== "1") {
      router.replace("/ar-entry");
    }
  }, [router]);

  if (!flowCompleted) return null;

  return <PatientHomeDashboard />;
}
