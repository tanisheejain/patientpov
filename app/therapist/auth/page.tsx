"use client";

import {
  getStoredTherapistAuth,
  storeTherapistAuth,
} from "@/components/auth/therapistAuthStorage";
import { INTRO_STORAGE_KEY } from "@/components/intro/introStorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_BG =
  "min-h-screen bg-[radial-gradient(1100px_circle_at_50%_55%,rgba(163,188,251,0.55),transparent_62%),radial-gradient(1000px_circle_at_18%_92%,rgba(254,162,88,0.70),transparent_60%),linear-gradient(180deg,#ffffff,#ffffff)] text-black";

export default function TherapistAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const introPassed =
    searchParams.get("intro") === "1" ||
    (typeof window !== "undefined" &&
      window.localStorage.getItem(INTRO_STORAGE_KEY) === "1");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    if (!introPassed) {
      router.replace("/intro?next=%2Ftherapist%2Fauth");
      return;
    }

    if (getStoredTherapistAuth()) {
      router.replace("/therapist");
    }
  }, [introPassed, router]);

  const submitLogin = () => {
    if (!loginEmail.trim()) return;
    storeTherapistAuth({
      email: loginEmail,
      name: deriveNameFromEmail(loginEmail),
    });
    router.replace("/therapist");
  };

  const submitSignup = () => {
    if (!signupEmail.trim()) return;
    storeTherapistAuth({
      email: signupEmail,
      name: signupName.trim() || deriveNameFromEmail(signupEmail),
    });
    router.replace("/therapist");
  };

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-2xl">
          <header className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Therapist Access
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
              Log in or create a therapist account before opening the dashboard.
            </p>
          </header>

          <section className="mt-8 rounded-3xl border border-black/10 bg-white/95 p-5 shadow-[0_28px_80px_-58px_rgba(0,0,0,0.45)] sm:mt-10 sm:p-6">
            <div className="flex gap-2 rounded-2xl border border-black/10 bg-white p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={[
                  "h-10 flex-1 rounded-2xl text-sm font-semibold transition",
                  mode === "login"
                    ? "bg-gradient-to-r from-[rgba(254,162,88,0.25)] to-[rgba(163,188,251,0.28)]"
                    : "hover:bg-black/[0.02]",
                ].join(" ")}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={[
                  "h-10 flex-1 rounded-2xl text-sm font-semibold transition",
                  mode === "signup"
                    ? "bg-gradient-to-r from-[rgba(254,162,88,0.25)] to-[rgba(163,188,251,0.28)]"
                    : "hover:bg-black/[0.02]",
                ].join(" ")}
              >
                Sign up
              </button>
            </div>

            {mode === "login" ? (
              <>
                <div className="mt-5 grid grid-cols-1 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">Email</span>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      placeholder="therapist@example.com"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">Password</span>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={submitLogin}
                  disabled={!loginEmail.trim() || !loginPassword.trim()}
                  className={[
                    "group relative mt-5 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2",
                    loginEmail.trim() && loginPassword.trim()
                      ? "bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] saturate-125 brightness-[0.85] shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] hover:brightness-[0.92]"
                      : "cursor-not-allowed border border-black/10 bg-white text-black/40",
                  ].join(" ")}
                >
                  <span className="relative">Log in to dashboard</span>
                </button>
              </>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-1 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">Name</span>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(event) => setSignupName(event.target.value)}
                      placeholder="Dr. Jane Doe"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">Email</span>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(event) => setSignupEmail(event.target.value)}
                      placeholder="therapist@example.com"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-black/65">Password</span>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(event) => setSignupPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={submitSignup}
                  disabled={!signupEmail.trim() || !signupPassword.trim()}
                  className={[
                    "group relative mt-5 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2",
                    signupEmail.trim() && signupPassword.trim()
                      ? "bg-gradient-to-r from-[#FEA258] to-[#A3BCFB] saturate-125 brightness-[0.85] shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] hover:brightness-[0.92]"
                      : "cursor-not-allowed border border-black/10 bg-white text-black/40",
                  ].join(" ")}
                >
                  <span className="relative">Create account</span>
                </button>
              </>
            )}

            <div className="mt-4 rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3 text-xs leading-5 text-black/60">
              This is a placeholder therapist auth step stored locally in the browser. Hook it up to a real auth provider when you are ready.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function deriveNameFromEmail(email: string) {
  const local = email.trim().split("@")[0] ?? "";
  if (!local) return "Therapist";

  const base = local.split(/[._-]+/).filter(Boolean)[0] ?? local;
  return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
}
