import { TherapistDashboard } from "@/components/dashboard/TherapistDashboard";
import { redirect } from "next/navigation";

type TherapistPageProps = {
  searchParams?: Promise<{
    intro?: string;
  }>;
};

export default async function TherapistPage({ searchParams }: TherapistPageProps) {
  const params = searchParams ? await searchParams : undefined;

  if (params?.intro !== "1") {
    redirect("/intro?next=%2Ftherapist%3Fintro%3D1");
  }

  return <TherapistDashboard />;
}
