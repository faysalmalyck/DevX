type Props = {
  total: number;
  published: number;
  draft: number;
  featured: number;
};

export default function CareerStats({
  total,
  published,
  draft,
  featured,
}: Props) {
  const cards = [
    {
      title: "Total Jobs",
      value: total,
    },
    {
      title: "Published",
      value: published,
    },
    {
      title: "Draft",
      value: draft,
    },
    {
      title: "Featured",
      value: featured,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-500">
            {card.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}