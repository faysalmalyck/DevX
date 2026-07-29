import { Career } from '@/data/careers';

export default function CareerDetails({ career }: { career: Career }) {
  return (
    <div className="space-y-12">
      {/* Responsibilities */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Key Responsibilities</h2>
        <ul className="space-y-3">
          {career.responsibilities.map((item, index) => (
            <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Requirements & Qualifications</h2>
        <ul className="space-y-3">
          {career.requirements.map((item, index) => (
            <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preferred Qualifications */}
      {career.preferredQualifications && career.preferredQualifications.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Preferred Qualifications</h2>
          <ul className="space-y-3">
            {career.preferredQualifications.map((item, index) => (
              <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
