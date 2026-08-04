"use client"
import React, { useState, useEffect } from 'react';
import SocialLinks from '@/components/contact/social-links';
import FAQ from '@/components/contact/FAQ';



export default function ContactHeroSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Force scroll position to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="bg-white dark:bg-[#181d2b] min-h-screen w-full flex flex-col">
      {/* Updated pt-36 (144px top padding) and changed items-center to items-start for clean top alignment */}
      <section className="text-slate-900 dark:text-slate-100 flex items-start justify-center p-4 pt-36">
        {/* Outer wrapper maintaining max dimensions 1268 x 739 on desktop */}
      <div className="w-full lg:w-[1268px] lg:h-[739px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-end justify-items-center">
        
        {/* Inner Left Div - Fixed 518.18 x 494.1 on desktop */}
        <div className="mt-0 w-full max-w-full lg:w-[518.18px] lg:h-[494.1px] space-y-8 flex flex-col justify-between my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-normal tracking-tight text-slate-900 dark:text-white">
              Get in <span className="text-blue-500">touch</span> with our team
            </h1>
            <p className="text-slate-600 dark:text-white text-base md:text-l max-w-md">
              Let's discuss your ideas, answer your questions, and explore how we can help transform your vision into a scalable digital solution.
            </p>
          </div>

          {/* Contact block */}
          <div className="space-y-4 pt-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Contact information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-w-sm">
              <a
                href="mailto:faysal.malick@icloud.com"
                className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#232c3e] border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-slate-900 dark:text-slate-200">faysal.malick@icloud.com</span>
              </a>

              <a
                href="tel:+923055552772"
                className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#232c3e] border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-slate-900 dark:text-slate-200">+92 305 5552772</span>
              </a>
            </div>
          </div>
        </div>

        {/* Inner Right Div - Responsive on mobile, Fixed 621 x 739 on desktop */}
        <div className="w-full h-auto lg:w-[621px] lg:h-[739px] bg-white dark:bg-[#181d2b] flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-white font-sans">
          <div className="w-full h-full bg-slate-50 dark:bg-[#232c3e] rounded-l border border-slate-200 dark:border-[#273046] p-6 md:p-12 shadow-xl dark:shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid pt-8 grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Carter"
                      className="w-full px-5 py-3.5 rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full px-5 py-3.5 rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456 - 789"
                      className="w-full px-5 py-3.5 rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300"
                    />
                  </div>

                  {/* Company Field */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="company" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Facebook"
                      className="w-full px-5 py-3.5 rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Leave us a message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please type your message here..."
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-5.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Get in touch'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
      
      </section>

      {/* Social Links Section */}
      <SocialLinks />

      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}