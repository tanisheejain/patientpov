export function SceneCard(props: {
  title: string;
  emoji: string;
  interpretation: string;
}) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-[0_10px_28px_-22px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{props.title}</div>
          <div className="mt-2 text-xs leading-5 text-black/65">
            {props.interpretation}
          </div>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-gradient-to-br from-[rgba(254,162,88,0.18)] to-[rgba(163,188,251,0.20)] text-xl">
          <span aria-label="Selected response">{props.emoji}</span>
        </div>
      </div>
    </div>
  );
}

