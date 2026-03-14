import { FLOW_COMPLETED_COOKIE } from "@/components/flow/storage";
import { PatientHomeDashboard } from "@/components/dashboard/PatientHomeDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const flowCompleted = cookieStore.get(FLOW_COMPLETED_COOKIE)?.value === "1";

  if (!flowCompleted) redirect("/ar-entry");

  return <PatientHomeDashboard />;
}
