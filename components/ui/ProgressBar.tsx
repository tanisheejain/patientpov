import { clamp01 } from "@/components/utils/number";

export function ProgressBar(props: {
  value01: number;
  trackClassName?: string;
  fillClassName?: string;
  ariaLabel?: string;
}) {
  const value = clamp01(props.value01);
  const valuePct = Math.round(value * 100);

  return (
    <div className={["h-3 w-full rounded-full", props.trackClassName].join(" ")}>
      <div
        className={[
          "h-3 rounded-full transition-[width] duration-700 ease-out",
          props.fillClassName,
        ].join(" ")}
        style={{ width: `${valuePct}%` }}
        aria-label={props.ariaLabel ?? "Progress"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valuePct}
        role="progressbar"
      />
    </div>
  );
}

