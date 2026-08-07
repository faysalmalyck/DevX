import { Pencil, Trash2 } from "lucide-react";

export interface Career {
  id: string;
  title: string;
  slug?: string;
  department: string;
  category?: string;
  location: string;
  employmentType?: string;
  workMode?: string;
  experience: string;
  shortDescription?: string;
  overview?: string;
  status: string;
  featured: boolean;
}

interface Props {
  careers: Career[];
  onEdit: (career: Career) => void;
}

export default function CareerTable({
  careers,
  onEdit,
}: Props) {
  if (careers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-xl font-semibold">
          No careers found
        </h3>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Click "Add Career" to create your first job.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Position
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Department
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Location
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Experience
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Featured
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {careers.map((career) => (
              <tr
                key={career.id}
                className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4 font-medium">
                  {career.title}
                </td>

                <td className="px-6 py-4">
                  {career.department}
                </td>

                <td className="px-6 py-4">
                  {career.location}
                </td>

                <td className="px-6 py-4">
                  {career.experience}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      career.status === "Published"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                    }`}
                  >
                    {career.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center text-lg">
                  {career.featured ? "⭐" : "—"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(career)}
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-500/10"
                      title="Edit Career"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/10"
                      title="Delete Career"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}