"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Career {
  id: number;
  title: string;
  location: string;
  type: string;
  mode: string;
  experience: string;
  status: string;
}

const careers: Career[] = [
  {
    id: 1,
    title: "React Native Developer",
    location: "Islamabad",
    type: "Full Time",
    mode: "Hybrid",
    experience: "2-4 Years",
    status: "Active",
  },
  {
    id: 2,
    title: "NodeJS Developer",
    location: "Islamabad",
    type: "Full Time",
    mode: "Hybrid",
    experience: "3-5 Years",
    status: "Active",
  },
];

export default function CareerManagement() {
  const [search, setSearch] = useState("");

  const filteredCareers = careers.filter((career) =>
    career.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Career Management
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage job openings and career applications.
          </p>
        </div>


        <button
          className="
          inline-flex items-center justify-center gap-2
          rounded-lg bg-blue-600 px-5 py-3
          text-sm font-medium text-white
          transition hover:bg-blue-700
          "
        >
          <Plus size={18} />
          Add Career
        </button>

      </div>


      <div
        className="
        rounded-xl border border-slate-200
        bg-white p-5 shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        "
      >

        <div className="relative mb-5 max-w-md">

          <Search
            size={18}
            className="
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-400
            "
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers..."
            className="
            w-full rounded-lg
            border border-slate-300
            bg-transparent
            py-3 pl-10 pr-4
            text-sm
            outline-none
            focus:border-blue-500
            dark:border-slate-700
            dark:text-white
            "
          />

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr
                className="
                border-b border-slate-200
                text-sm text-slate-500
                dark:border-slate-800
                dark:text-slate-400
                "
              >
                <th className="pb-4">Title</th>
                <th className="pb-4">Location</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Experience</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>


            <tbody>

              {filteredCareers.map((career) => (

                <tr
                  key={career.id}
                  className="
                  border-b border-slate-100
                  text-sm
                  dark:border-slate-800
                  "
                >

                  <td className="py-4 font-medium text-slate-900 dark:text-white">
                    {career.title}
                  </td>


                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {career.location}
                  </td>


                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {career.type}
                  </td>


                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {career.experience}
                  </td>


                  <td className="py-4">

                    <span
                      className="
                      rounded-full
                      bg-green-100
                      px-3 py-1
                      text-xs
                      font-medium
                      text-green-700
                      dark:bg-green-900/30
                      dark:text-green-400
                      "
                    >
                      {career.status}
                    </span>

                  </td>


                  <td className="py-4">

                    <div className="flex gap-2">

                      <button
                        className="
                        rounded-lg p-2
                        text-slate-500
                        hover:bg-slate-100
                        hover:text-blue-600
                        dark:hover:bg-slate-800
                        "
                      >
                        <Edit size={17} />
                      </button>


                      <button
                        className="
                        rounded-lg p-2
                        text-slate-500
                        hover:bg-slate-100
                        hover:text-red-600
                        dark:hover:bg-slate-800
                        "
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}