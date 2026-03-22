import { TherapistAuthPageClient } from "@/components/auth/TherapistAuthPageClient";
import { Suspense } from "react";

export default function TherapistAuthPage() {
  return (
    <Suspense fallback={null}>
      <TherapistAuthPageClient />
    </Suspense>
  );
}
