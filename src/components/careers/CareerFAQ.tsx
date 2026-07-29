import { Career } from '@/data/careers';

export default function CareerFAQ({ career }: { career: Career }) {
  if (!career.faqs || career.faqs.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {career.faqs.map((faq, index) => (
          <div key={index} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{faq.question}</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
