import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from "firebase/firestore";

export const FLOW_COMPLETED_SESSION_KEY = "patientpov_flow_completed_tab_v1";
const LOCAL_APPOINTMENTS_KEY = "patientpov_appointments_v1";

export type AppointmentRecord = {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  therapistId: string;
  therapistName: string;
  concern: string;
  sessionNumber: number;
  dateISO: string;
  time: string;
  mode: "In-person" | "Online";
  createdAtISO: string;
};

export type NewAppointmentInput = Omit<AppointmentRecord, "id" | "createdAtISO">;

export async function listAppointments() {
  const localRows = readLocalAppointments();

  try {
    const q = query(collection(db, "appointments"), orderBy("createdAtISO", "desc"));
    const snapshot = await getDocs(q);
    const remoteRows = snapshot.docs
      .map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        return isAppointmentRecord(data) ? data : null;
      })
      .filter(Boolean) as AppointmentRecord[];

    const merged = mergeAppointments(localRows, remoteRows);
    writeLocalAppointments(merged);
    return merged;
  } catch (error) {
    console.warn("Could not fetch remote appointments; using local cache.", error);
    return localRows;
  }
}

export async function saveAppointment(input: NewAppointmentInput) {
  const appointmentWithoutId: Omit<AppointmentRecord, "id"> = {
    ...input,
    createdAtISO: new Date().toISOString(),
  };
  const tempId = buildLocalId();
  const tempRecord: AppointmentRecord = {
    id: tempId,
    ...appointmentWithoutId,
  };

  upsertLocalAppointment(tempRecord);

  try {
    const doc = await addDoc(collection(db, "appointments"), appointmentWithoutId);
    const remoteRecord: AppointmentRecord = { id: doc.id, ...appointmentWithoutId };
    replaceLocalAppointmentId(tempId, remoteRecord);
    return remoteRecord;
  } catch (error) {
    console.warn("Could not save remote appointment; kept local copy.", error);
    return tempRecord;
  }
}

export function subscribeAppointments(
  onChange: (rows: AppointmentRecord[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const emit = (remoteRows: AppointmentRecord[] = []) => {
    const localRows = readLocalAppointments();
    onChange(mergeAppointments(localRows, remoteRows));
  };

  emit();

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === LOCAL_APPOINTMENTS_KEY) {
      emit();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  const q = query(collection(db, "appointments"), orderBy("createdAtISO", "desc"));
  const unsubscribeRemote = onSnapshot(
    q,
    (snapshot) => {
      const remoteRows = snapshot.docs
        .map((doc) => {
          const data = { id: doc.id, ...doc.data() };
          return isAppointmentRecord(data) ? data : null;
        })
        .filter(Boolean) as AppointmentRecord[];

      const merged = mergeAppointments(readLocalAppointments(), remoteRows);
      writeLocalAppointments(merged);
      onChange(merged);
    },
    (error) => {
      onError?.(error);
      emit();
    },
  );

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
    unsubscribeRemote();
  };
}

function isAppointmentRecord(value: unknown): value is AppointmentRecord {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<AppointmentRecord>;
  return (
    typeof row.id === "string" &&
    typeof row.patientId === "string" &&
    typeof row.patientName === "string" &&
    typeof row.patientEmail === "string" &&
    typeof row.therapistId === "string" &&
    typeof row.therapistName === "string" &&
    typeof row.concern === "string" &&
    typeof row.sessionNumber === "number" &&
    typeof row.dateISO === "string" &&
    typeof row.time === "string" &&
    (row.mode === "In-person" || row.mode === "Online") &&
    typeof row.createdAtISO === "string"
  );
}

function mergeAppointments(...groups: AppointmentRecord[][]) {
  const byId = new Map<string, AppointmentRecord>();
  for (const group of groups) {
    for (const row of group) {
      byId.set(row.id, row);
    }
  }
  return Array.from(byId.values()).sort((a, b) =>
    b.createdAtISO.localeCompare(a.createdAtISO),
  );
}

function readLocalAppointments() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(LOCAL_APPOINTMENTS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isAppointmentRecord);
  } catch {
    return [];
  }
}

function writeLocalAppointments(rows: AppointmentRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(rows));
}

function upsertLocalAppointment(appointment: AppointmentRecord) {
  const merged = mergeAppointments(readLocalAppointments(), [appointment]);
  writeLocalAppointments(merged);
}

function replaceLocalAppointmentId(tempId: string, next: AppointmentRecord) {
  const rows = readLocalAppointments().filter((row) => row.id !== tempId);
  rows.push(next);
  writeLocalAppointments(
    rows.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
  );
}

function buildLocalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `local-${crypto.randomUUID()}`;
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
