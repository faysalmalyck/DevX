import { Career } from '@/data/careers';

export default function CareerDetails({ career }: { career: Career }) {
  return (
    <div className="max-w-3xl mx-auto text-left space-y-8">
      {/* Job Requirements */}
      <div className="space-y-6">
        <h2 className="text-3xl text-slate-900 dark:text-white">
          Job Requirements
        </h2>

        {career.requirementsDescription && (
          <p className="text-base sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {career.requirementsDescription}
          </p>
        )}

        <ul className="space-y-3">
          {career.requirements.map((item, index) => (
            <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preferred Qualifications */}
      {career.preferredQualifications && career.preferredQualifications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl text-slate-900 dark:text-white">
            Preferred Qualifications
          </h3>
          <ul className="space-y-3">
            {career.preferredQualifications.map((item, index) => (
              <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}