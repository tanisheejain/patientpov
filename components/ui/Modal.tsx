import type { PropsWithChildren } from "react";

export function Modal(
  props: PropsWithChildren<{
    open: boolean;
    title?: string;
    onClose: () => void;
  }>,
) {
  if (!props.open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={props.title ?? "Dialog"}
    >
      <button
        type="button"
        onClick={props.onClose}
        className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"
        aria-label="Close dialog"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-5 shadow-[0_20px_70px_-40px_rgba(0,0,0,0.55)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {props.title ? (
              <div className="text-base font-semibold">{props.title}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold text-black/70 transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-[#A3BCFB] focus:ring-offset-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">{props.children}</div>
      </div>
    </div>
  );
}

