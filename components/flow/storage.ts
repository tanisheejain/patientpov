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
  const q = query(collection(db, "appointments"), orderBy("createdAtISO", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return isAppointmentRecord(data) ? data : null;
    })
    .filter(Boolean) as AppointmentRecord[];
}

export async function saveAppointment(input: NewAppointmentInput) {
  const appointment: Omit<AppointmentRecord, "id"> = {
    ...input,
    createdAtISO: new Date().toISOString(),
  };
  const doc = await addDoc(collection(db, "appointments"), appointment);
  return { id: doc.id, ...appointment };
}

export function subscribeAppointments(
  onChange: (rows: AppointmentRecord[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(collection(db, "appointments"), orderBy("createdAtISO", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const rows = snapshot.docs
        .map((doc) => {
          const data = { id: doc.id, ...doc.data() };
          return isAppointmentRecord(data) ? data : null;
        })
        .filter(Boolean) as AppointmentRecord[];
      onChange(rows);
    },
    (error) => onError?.(error),
  );
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
