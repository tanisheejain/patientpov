import {
  AssessmentResultsDashboard,
  type AssessmentResults,
} from "@/components/assessment/AssessmentResultsDashboard";

export default function ReportViewPage() {
  const assessment: AssessmentResults = {
    severity: {
      label: "Moderate",
      score01: 0.62,
      caption: "Your responses suggest some discomfort in confined spaces.",
    },
    triggers: ["Narrow corridors", "Limited movement", "Crowded elevator"],
    scenes: [
      {
        title: "Scene 1 – Corridor",
        emoji: "😬",
        interpretation: "Mild tension in narrow or enclosed walkways.",
      },
      {
        title: "Scene 2 – Boxes Room",
        emoji: "😟",
        interpretation: "Increased discomfort when space feels cluttered.",
      },
      {
        title: "Scene 3 – Elevator",
        emoji: "😣",
        interpretation: "Highest discomfort in crowded, closed environments.",
      },
    ],
    recommendation:
      "Your responses suggest moderate discomfort in confined spaces. Working with a therapist can help.",
  };

  return (
    <AssessmentResultsDashboard
      assessment={assessment}
      showBackToHome
      showBookAppointment={false}
    />
  );
}
