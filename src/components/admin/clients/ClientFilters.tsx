"use client";

export type ClientFiltersState = {
  search: string;
  status: string;
  featured: string;
  industry: string;
  country: string;
  sort: string;
};

export default function ClientFilters({
  value,
  onChange,
}: {
  value: ClientFiltersState;
  onChange: (value: ClientFiltersState) => void;
}) {
  const field = (key: keyof ClientFiltersState, label: string, options?: string[]) => (
    <label className="text-xs font-semibold text-slate-700 dark:text-[#c9d0e1]">
      {label}
      {options ? (
        <select
          value={value[key]}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          className="mt-1 consultation-select text-xs sm:text-sm py-2 px-3"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value[key]}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          placeholder="Search companies"
          className="mt-1 consultation-input text-xs sm:text-sm py-2 px-3"
        />
      )}
    </label>
  );

  return (
    <div className="cart-skin-box grid gap-3 rounded-2xl p-4 md:grid-cols-6">
      {field("search", "Search")}
      {field("status", "Status", ["All statuses", "ACTIVE", "HIDDEN"])}
      {field("featured", "Featured", ["All clients", "Featured", "Not featured"])}
      {field("industry", "Industry")}
      {field("country", "Country")}
      {field("sort", "Sort", ["Display order", "Company name", "Newest"])}
    </div>
  );
}
