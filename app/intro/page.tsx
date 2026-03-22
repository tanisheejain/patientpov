import { IntroPageClient } from "@/components/intro/IntroPageClient";
import { Suspense } from "react";

export default function IntroPage() {
  return (
    <Suspense fallback={null}>
      <IntroPageClient />
    </Suspense>
  );
}
