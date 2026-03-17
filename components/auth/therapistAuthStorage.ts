export const THERAPIST_AUTH_STORAGE_KEY = "patientpov_therapist_auth_v1";

export function getStoredTherapistAuth() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(THERAPIST_AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      email?: string;
      name?: string;
    };

    if (typeof parsed.email !== "string" || !parsed.email.trim()) return null;

    return {
      email: parsed.email.trim().toLowerCase(),
      name:
        typeof parsed.name === "string" && parsed.name.trim()
          ? parsed.name.trim()
          : "Therapist",
    };
  } catch {
    return null;
  }
}

export function storeTherapistAuth(input: { email: string; name?: string }) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    THERAPIST_AUTH_STORAGE_KEY,
    JSON.stringify({
      email: input.email.trim().toLowerCase(),
      name: input.name?.trim() || "Therapist",
    }),
  );
}
