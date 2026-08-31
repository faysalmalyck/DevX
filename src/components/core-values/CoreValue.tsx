import Image from "next/image";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion";

interface ValueItem {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
}

const valuesData: ValueItem[] = [
  {
    id: "quality",
    title: "Best quality",
    description:
      "Quality is at the core of everything we do. Every stage, from planning and architecture to development testing & deployment is guided by rigorous standards and attention to detail.",
    iconSrc:
      "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/62196208d87ca1caec724ec9_icon-6-values-dev-template.svg",
  },
  {
    id: "infrastructure",
    title: "Top tier infrastructure",
    description:
      "Built on secure, high performance cloud infrastructure that delivers exceptional speed, reliability, and scalability for mission critical applications.",
    iconSrc:
      "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/62196208065f1056cea08ee5_icon-5-values-dev-template.svg",
  },
  {
    id: "innovation",
    title: "Innovation & Technology",
    description:
      "We combine innovation with cutting-edge technology to create scalable, secure, and future-ready solutions that help businesses adapt, grow, and lead in a rapidly evolving digital world.",
    iconSrc:
      "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/62196208a2c0380f90a22ae3_icon-4-values-dev-template.svg",
  },
  {
    id: "iterate",
    title: "Always iterate",
    description:
      "Every project is an opportunity to learn, improve, and evolve. We iterate continuously to deliver greater value over time.",
    iconSrc:
      "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/621962070a582b5db1131901_icon-3-values-dev-template.svg",
  },
  {
    id: "user-centered",
    title: "User centered",
    description:
      "We put users at the center of every decision, designing intuitive, accessible, and meaningful experiences that solve real problems.",
    iconSrc:
      "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/62196207e572c8555afc7b68_icon-2-values-dev-template.svg",
  },
  {
    id: "escalation",
    title: "Escalation in mind",
    description:
      "Build every solution with scalability in mind, ensuring it can grow seamlessly alongside your business and future demands.",
    iconSrc:
      "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/62196207e55736043e29b3c8_icon-1-values-dev-template.svg",
  },
];

export default function CoreValues() {
  return (
    <section className=" bg-white dark:bg-[#181d2b] text-slate-900 dark:text-white pt-36 pb-16 md:pt-40 md:pb-24 transition-colors duration-200">
      <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end lg:mb-16">
          <ScrollReveal className="max-w-2xl" preset="heading">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl text-slate-900 dark:text-white">
              The <span className="text-brand dark:text-brand">core values</span> that drive everything <span className="whitespace-nowrap">we do</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.12} preset="copy">
            <Link
              href="/careers"
              className="inline-block w-full rounded-full bg-brand px-10 py-6 text-center text-lg font-semibold text-white transition-all duration-200 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] sm:w-auto"
            >
              Join Our Team
            </Link>
          </ScrollReveal>
        </div>

        {/* Grid Container */}
        <StaggerContainer className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
          {valuesData.map((item) => (
            <StaggerItem key={item.id} className="h-full max-w-md" preset="copy">
              <div className="flex h-full flex-col items-start">
                <ScrollReveal className="mb-6 flex h-16 w-16 items-center justify-center dark:invert-0 invert" preset="image">
                  <Image
                    src={item.iconSrc}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="h-auto w-auto"
                  />
                </ScrollReveal>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-600 dark:text-white">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
