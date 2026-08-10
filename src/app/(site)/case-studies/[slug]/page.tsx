  import { Metadata } from 'next';
  import { notFound } from 'next/navigation';
  import { getCaseStudyBySlug, caseStudiesData } from '@/data/case-studies';
  import CaseStudyHero from '@/components/case-studies/CaseStudyHero';
  import ProjectOverview from '@/components/case-studies/ProjectOverview';
  import ResultsMetrics from '@/components/case-studies/ResultsMetrics';
  import RelatedProjects from '@/components/case-studies/RelatedProjects';
  import CtaSection from '@/components/home/ready-to-contact/Ready';

  interface PageProps {
    params: Promise<{
      slug: string;
    }>;
  }

  // Helper to strip leading slashes or paths if data has them
  const cleanSlug = (slug: string) => slug.replace(/^\/case-studies\//, '').replace(/^\//, '');

  export async function generateStaticParams() {
    return caseStudiesData.map((study) => ({
      slug: cleanSlug(study.slug),
    }));
  }

  export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const normalizedSlug = cleanSlug(slug);
    const study = getCaseStudyBySlug(normalizedSlug) || getCaseStudyBySlug(slug);

    if (!study) {
      return {
        title: 'Case Study Not Found',
      };
    }

    return {
      title: `${study.title} | Case Studies`,
      description: Array.isArray(study.overview) 
        ? study.overview.join(' ') 
        : study.overview?.description?.join(' ') || '',
      openGraph: {
        title: `${study.title} | Case Studies`,
        description: Array.isArray(study.overview) 
          ? study.overview.join(' ') 
          : study.overview?.description?.join(' ') || '',
      },
    };
  }

  export default async function CaseStudyDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const normalizedSlug = cleanSlug(slug);
    const study = getCaseStudyBySlug(normalizedSlug) || getCaseStudyBySlug(slug);

    if (!study) {
      notFound();
    }

    return (
      <div className="bg-[#0B0F17] text-white min-h-screen selection:bg-brand selection:text-white">
        {/* Section 1 — Hero */}
        <CaseStudyHero study={study} />

        {/* Section 2 — Project Overview & Metadata Grid */}
        <ProjectOverview study={study} />

        {/* Section 3 — Project Results & Showcase */}
        <ResultsMetrics study={study} />

        {/* Bottom Related Case Studies */}
        <RelatedProjects currentId={study.id} />

        {/* CTA Section */}
        <CtaSection />
      </div>
    );
  }