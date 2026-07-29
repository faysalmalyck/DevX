'use client';

import { Career } from '@/data/careers';

export default function CareerCTA({ career }: { career: Career }) {
  return (
    <div id="apply" className="p-8 bg-blue-600 dark:bg-blue-700 text-white rounded-3xl shadow-xl space-y-6">
      <h3 className="text-2xl font-semibold">Apply for this role</h3>
      <p className="text-blue-100 text-sm leading-relaxed">
        Ready to take the next step in your career? Submit your application and our talent acquisition team will get back to you shortly.
      </p>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Full Name</label>
          <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Email Address</label>
          <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Resume / CV Link</label>
          <input type="url" placeholder="https://linkedin.com/in/username" className="w-full px-4 py-3 rounded-xl text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Cover Note</label>
          <textarea rows={3} placeholder="Tell us why you are a great fit..." className="w-full px-4 py-3 rounded-xl text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
        </div>
        <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-md">
          Submit Application
        </button>
      </form>
    </div>
  );
}
