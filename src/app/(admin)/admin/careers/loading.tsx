export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded bg-slate-200 dark:bg-slate-700" />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-lg bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>

      <div className="h-12 rounded-lg bg-slate-200 dark:bg-slate-700" />

      <div className="h-96 rounded-lg bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}