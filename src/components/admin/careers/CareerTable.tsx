import { Pencil, Trash2 } from "lucide-react";

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  status: string;
  featured: boolean;
}

interface Props {
  careers: Career[];
}

export default function CareerTable({ careers }: Props) {
  if (careers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
        <h3 className="text-xl font-semibold">
          No careers found
        </h3>

        <p className="mt-2 text-slate-500">
          Click "Add Career" to create your first job.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-6 py-4 text-left">Position</th>
            <th className="px-6 py-4 text-left">Department</th>
            <th className="px-6 py-4 text-left">Location</th>
            <th className="px-6 py-4 text-left">Experience</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-center">Featured</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {careers.map((career) => (
            <tr
              key={career.id}
              className="border-t border-slate-200 dark:border-slate-700"
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
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {career.status}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                {career.featured ? "⭐" : "—"}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Pencil size={18} />
                  </button>

                  <button className="rounded-lg p-2 hover:bg-red-100 dark:hover:bg-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}