import { Star } from "lucide-react";

export default function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) {
    return <span className="text-slate-400 dark:text-slate-500">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-brand dark:bg-brand/10 dark:text-brand">
      <Star className="h-3.5 w-3.5 fill-current" />
      Featured
    </span>
  );
}
