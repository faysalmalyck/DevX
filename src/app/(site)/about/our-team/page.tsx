import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Code2, LinkIcon, Mail, Sparkles } from "lucide-react";
import { getImgPath } from "@/utils/image";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the focused Vertex team building modern digital products for growing businesses.",
};

const ceoMember = {
  name: "Faysal Mushtaq",
  role: "CEO & Founder",
  description:
    "Leading the company with strategic vision, innovation, and a commitment to sustainable growth.Guiding teams and strategy to deliver exceptional digital solutions and lasting client value.",
  image: "/images/hero/faysal.webp",
};

const engineeringMembers = [
  {
    name: "Barkat",
    role: "CTO & Sr. Software Engineer",
    description:
      "Leading engineering teams to build secure, scalable, and high performance software..",
    image: "/images/hero/hero-profile-1.jpg",
  },
  {
    name: "Raja Saad Raza",
    role: "IOS App Engineer",
    description: "Developing high performance iOS apps for every stage of growth.",
    image: "/images/hero/hero-profile-2.jpg",
  },
  {
    name: "Usama Ishaq",
    role: "Andriod/IOS App Engineer",
    description: "Designing responsive Android apps that deliver exceptional experiences.",
    image: "/images/hero/usama.webp",
  },
];

const salesMembers = [
  {
    name: "Saqib Mushtaq",
    role: "Account Executive (EdTech)",
    description:
      "Helping education partners achieve growth through tailored technology solutions.",
    image: "/images/hero/saqib.webp",
  },
  
  {
    name: "Afzal Ashraf",
    role: "Account Executive",
    description:
      "Manages enterprise client success, product positioning, and strategic alignment.",
    image: "/images/hero/hero-profile-3.jpg",
  },
];

export default function TeamPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="premium-shell premium-mesh relative pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="container relative z-10 mx-auto max-w-6xl px-4 text-center">
          <div className="premium-badge mx-auto mb-6 w-fit">
            <span className="h-2 w-2 rounded-full bg-success" />
            Vertex studio
          </div>
          <h1 className="premium-heading mx-auto mt-7 max-w-4xl">
            Meet the Professionals Behind Vertex
          </h1>
          <p className="premium-copy mx-auto mt-6 max-w-3xl">
            A focused team building modern digital products for growing businesses.
          </p>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="relative overflow-hidden bg-section py-20 dark:bg-darkmode">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(139,92,246,0.15),transparent_40rem),radial-gradient(circle_at_85%_60%,rgba(34,211,238,0.10),transparent_26rem)]" />
        
        <div className="container relative mx-auto max-w-5xl px-4">
          
          {/* 1. Premium CEO Spotlight Card */}
          <div className="mb-20 flex justify-center">
            <article
              className="glass-card group relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-[0_30px_90px_rgba(245,158,11,0.15)]"
              data-aos="fade-up"
            >
              <div className="absolute right-8 top-8 z-20 hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-500 backdrop-blur-md sm:flex">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Leadership
              </div>

              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="relative aspect-[4/4.5] w-full shrink-0 overflow-hidden rounded-[2rem] bg-[#070A12] md:w-72">
                  <Image
                    src={getImgPath(ceoMember.image)}
                    alt={`${ceoMember.name}, ${ceoMember.role}`}
                    width={600}
                    height={700}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/92 via-[#070A12]/18 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="flex flex-col justify-between py-2">
                  <div>
                    <span className="mb-3 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-500 backdrop-blur-xl">
                      {ceoMember.role}
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                      {ceoMember.name}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-secondary dark:text-white/70">
                      {ceoMember.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    {[
                      { label: "LinkedIn", icon: LinkIcon },
                      { label: "GitHub", icon: Code2 },
                      { label: "Email", icon: Mail },
                    ].map(({ label, icon: Icon }) => (
                      <Link
                        key={label}
                        href="#"
                        aria-label={`${ceoMember.name} ${label}`}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-950/10 bg-white/60 text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-amber-500 hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65"
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* 2. Engineering Division */}
          <div className="relative mb-12 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-950/15 to-transparent dark:via-white/10" />
            <span className="absolute rounded-full border border-slate-950/10 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#070A12]/80 dark:text-white/60">
              Engineering Division
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl mb-24">
            {engineeringMembers.map((member, index) => (
              <article
                key={member.name}
                className="glass-card group relative h-full overflow-hidden rounded-[2rem] p-4 transition-all duration-500 hover:-translate-y-2 hover:border-Sky-blue-mist/30 hover:shadow-[0_30px_90px_rgba(139,92,246,0.18)]"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-[1.5rem] bg-[#070A12]">
                  <Image
                    src={getImgPath(member.image)}
                    alt={`${member.name}, ${member.role}`}
                    width={700}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/92 via-[#070A12]/18 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-transparent to-Sky-blue-mist/14 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-Sky-blue-mist backdrop-blur-xl">
                      {member.role}
                    </span>
                    <h2 className="text-2xl font-black text-white">
                      {member.name}
                    </h2>
                  </div>
                </div>

                <div className="px-2 pb-2 pt-6">
                  <p className="text-base leading-7 text-secondary dark:text-white/65">
                    {member.description}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {[
                      { label: "LinkedIn", icon: LinkIcon },
                      { label: "GitHub", icon: Code2 },
                      { label: "Email", icon: Mail },
                    ].map(({ label, icon: Icon }) => (
                      <Link
                        key={label}
                        href="#"
                        aria-label={`${member.name} ${label}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-950/10 bg-white/60 text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:text-white dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65"
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 3. Sales & Growth Division */}
          <div className="relative mb-12 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-950/15 to-transparent dark:via-white/10" />
            <span className="absolute rounded-full border border-slate-950/10 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#070A12]/80 dark:text-white/60">
              Sales & Growth Division
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
            {salesMembers.map((member, index) => (
              <article
                key={member.name}
                className="glass-card group relative h-full overflow-hidden rounded-[2rem] p-4 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-[0_30px_90px_rgba(6,182,212,0.15)]"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-[1.5rem] bg-[#070A12]">
                  <Image
                    src={getImgPath(member.image)}
                    alt={`${member.name}, ${member.role}`}
                    width={700}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/92 via-[#070A12]/18 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/18 via-transparent to-primary/14 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="mb-3 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-400 backdrop-blur-xl">
                      {member.role}
                    </span>
                    <h2 className="text-2xl font-black text-white">
                      {member.name}
                    </h2>
                  </div>
                </div>

                <div className="px-2 pb-2 pt-6">
                  <p className="text-base leading-7 text-secondary dark:text-white/65">
                    {member.description}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {[
                      { label: "LinkedIn", icon: LinkIcon },
                      { label: "Email", icon: Mail },
                    ].map(({ label, icon: Icon }) => (
                      <Link
                        key={label}
                        href="#"
                        aria-label={`${member.name} ${label}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-950/10 bg-white/60 text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500 hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65"
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
