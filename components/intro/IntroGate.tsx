"use client";

import { INTRO_STORAGE_KEY } from "@/components/intro/introStorage";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function IntroGate(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (typeof window === "undefined") return;

    const seen = window.localStorage.getItem(INTRO_STORAGE_KEY) === "1";
    const isIntroPage = pathname === "/intro";

    if (!seen && !isIntroPage) {
      router.replace("/intro");
    }
  }, [pathname, router]);

  return props.children;
}

