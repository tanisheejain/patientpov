"use client";

import { FLOW_COMPLETED_SESSION_KEY } from "@/components/flow/storage";
import { PatientHomeDashboard } from "@/components/dashboard/PatientHomeDashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [flowCompleted] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(FLOW_COMPLETED_SESSION_KEY) === "1";
  });

  useEffect(() => {
    if (!flowCompleted) {
      router.replace("/ar-entry");
    }
  }, [flowCompleted, router]);

  if (!flowCompleted) return null;

  return <PatientHomeDashboard />;
}
