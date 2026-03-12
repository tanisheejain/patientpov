import type { SessionMode, Therapist } from "@/components/booking/types";

export type BookingFilters = {
  sessionMode: SessionMode | "Any";
  language: string | "Any";
  price: "Any" | "Under $100" | "$100–$150" | "$150+";
};

export function FiltersRow(props: {
  filters: BookingFilters;
  onChange: (next: BookingFilters) => void;
  availableLanguages: string[];
}) {
  const { filters } = props;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-semibold">Filters</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Select
          label="Session type"
          value={filters.sessionMode}
          options={["Any", "Online", "In-person"]}
          onChange={(v) =>
            props.onChange({ ...filters, sessionMode: v as BookingFilters["sessionMode"] })
          }
        />
        <Select
          label="Language"
          value={filters.language}
          options={["Any", ...props.availableLanguages]}
          onChange={(v) =>
            props.onChange({ ...filters, language: v as BookingFilters["language"] })
          }
        />
        <Select
          label="Price range"
          value={filters.price}
          options={["Any", "Under $100", "$100–$150", "$150+"]}
          onChange={(v) =>
            props.onChange({ ...filters, price: v as BookingFilters["price"] })
          }
        />
      </div>
    </div>
  );
}

export function applyFilters(therapists: Therapist[], filters: BookingFilters) {
  return therapists.filter((t) => {
    if (filters.sessionMode !== "Any" && t.sessionMode !== filters.sessionMode) {
      return false;
    }
    if (filters.language !== "Any" && !t.languages.includes(filters.language)) {
      return false;
    }
    if (filters.price !== "Any") {
      if (filters.price === "Under $100") return t.fee < 100;
      if (filters.price === "$100–$150") return t.fee >= 100 && t.fee <= 150;
      if (filters.price === "$150+") return t.fee > 150;
    }
    return true;
  });
}

function Select(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-black/65">{props.label}</span>
      <select
        className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#A3BCFB]/70"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

