import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCareerBySlug, careersData } from '@/data/careers';
import CareerHero from '@/components/careers/CareerHero';
import CareerOverview from '@/components/careers/CareerOverview';
import CareerDetails from '@/components/careers/CareerDetails';
import CareerBenefits from '@/components/careers/CareerBenefits';
import HiringTimeline from '@/components/careers/HiringTimeline';
import CareerFAQ from '@/components/careers/CareerFAQ';
import CareerCTA from '@/components/careers/CareerCTA';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return careersData.map((career) => ({
    slug: career.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = getCareerBySlug(slug);

  if (!career) {
    return {
      title: 'Career Not Found',
    };
  }

  return {
    title: `${career.title} | Careers`,
    description: career.overview,
    openGraph: {
      title: `${career.title} | Careers`,
      description: career.overview,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: career.title,
      description: career.overview,
    },
  };
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);

  if (!career) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-[#181d2b] transition-colors duration-300 min-h-screen">
      <CareerHero career={career} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            <CareerOverview career={career} />
            <CareerDetails career={career} />
            <CareerBenefits career={career} />
            <HiringTimeline career={career} />
            <CareerFAQ career={career} />
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <CareerCTA career={career} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
