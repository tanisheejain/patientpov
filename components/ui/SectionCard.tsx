import type { PropsWithChildren } from "react";

export function SectionCard(
  props: PropsWithChildren<{
    title: string;
    description?: string;
    className?: string;
  }>,
) {
  return (
    <section
      className={[
        "rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)] sm:p-6",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold tracking-wide">{props.title}</h2>
        {props.description ? (
          <p className="text-xs leading-5 text-black/60">{props.description}</p>
        ) : null}
      </div>
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

