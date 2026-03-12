export type SeverityLabel = "Low" | "Moderate" | "High";

export function getSeverityStyles(label: SeverityLabel) {
  switch (label) {
    case "Low":
      return {
        badgeBg: "bg-[rgba(163,188,251,0.25)]",
        badgeText: "text-black",
        barFill: "bg-[#A3BCFB]",
        iconBg: "bg-[rgba(163,188,251,0.22)]",
        iconBorder: "border-[#A3BCFB]/40",
      };
    case "High":
      return {
        badgeBg: "bg-[rgba(254,162,88,0.35)]",
        badgeText: "text-black",
        barFill: "bg-[#FEA258]",
        iconBg: "bg-[rgba(254,162,88,0.22)]",
        iconBorder: "border-[#FEA258]/45",
      };
    case "Moderate":
    default:
      return {
        badgeBg:
          "bg-[linear-gradient(90deg,rgba(254,162,88,0.30),rgba(163,188,251,0.28))]",
        badgeText: "text-black",
        barFill: "bg-[linear-gradient(90deg,#FEA258,#A3BCFB)]",
        iconBg:
          "bg-[linear-gradient(135deg,rgba(254,162,88,0.20),rgba(163,188,251,0.20))]",
        iconBorder: "border-black/10",
      };
  }
}

