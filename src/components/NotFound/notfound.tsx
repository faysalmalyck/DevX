import Link from 'next/link';

export default function NotFoundHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-[633px]">
          <div className="relative">
            {/* Card Content */}
            <div className="relative z-10 rounded-lg bg-[#111726] via-[#1E2539] to-[#191f32] border border-slate-800 backdrop-blur-md p-8 md:p-12 text-center shadow-2xl">
              <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient tracking-tight mb-2">
                404
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Page not found
              </h1>
              
              <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed max-w-md mx-auto">
                Oops! The page you are looking for does not exist. It might have
                been moved or deleted.{' '}
                <span className="whitespace-nowrap"></span>
              </p>
              
              <div className="flex justify-center">
                <Link
                  href="/home"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Back home
                </Link>
              </div>
            </div>

            {/* Background Decorative Element: Animated Glow Square */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl animate-pulse pointer-events-none" />

            {/* Background Decorative Element: Animated Glow Circle */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gradient-to-tr from-pink-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}