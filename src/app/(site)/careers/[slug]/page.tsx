import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedCareerBySlug } from '@/lib/careers/queries';
import CareerHero from '@/components/careers/CareerHero';
import CareerOverview from '@/components/careers/CareerOverview';
import CareerDetails from '@/components/careers/Careerrequirement';
import HiringTimeline from '@/components/careers/HiringTimeline';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getPublishedCareerBySlug(slug);

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
  const career = await getPublishedCareerBySlug(slug);

  if (!career) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-[#181d2b] transition-colors duration-300 min-h-screen">
      <CareerHero career={career} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            <CareerOverview career={career} />
            <CareerDetails career={career} />
            <HiringTimeline career={career} />
            
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
