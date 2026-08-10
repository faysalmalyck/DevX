import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

interface Office {
  city: string;
  email: string;
  phone: string;
}

const officesData: Office[] = [
  {
    city: 'San Francisco, CA',
    email: 'sanfrancisco@dev.com',
    phone: '(415) 203-7468',
  },
  {
    city: 'New York, NY',
    email: 'newyork@dev.com',
    phone: '(212) 336 - 7281',
  },
  {
    city: 'Los Angeles, CA',
    email: 'losangeles@dev.com',
    phone: '(310) 203-7468',
  },
  {
    city: 'Chicago, IL',
    email: 'chicago@dev.com',
    phone: '(773) 336 - 7281',
  },
];

export default function OfficesSection() {
  return (
    <section className="py-16 md:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Heading and Office Details */}
            <div className="lg:col-span-6 max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-12 text-slate-900 leading-tight">
                Come and <span className="text-blue-600">visit us</span> in one of our offices worldwide
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {officesData.map((office) => (
                  <div key={office.city} className="flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-slate-800">
                      {office.city}
                    </h3>
                    <div className="flex flex-col space-y-3">
                      <a
                        href={`mailto:${office.email}`}
                        className="inline-flex items-center gap-2.5 text-slate-600 hover:text-blue-600 transition-colors text-base font-medium"
                      >
                        <Mail className="w-4 h-4 shrink-0 text-blue-600" />
                        <span>{office.email}</span>
                      </a>
                      <a
                        href={`tel:${office.phone.replace(/[^0-9]/g, '')}`}
                        className="inline-flex items-center gap-2.5 text-slate-600 hover:text-blue-600 transition-colors text-base font-medium"
                      >
                        <Phone className="w-4 h-4 shrink-0 text-blue-600" />
                        <span>{office.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Section Image */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[732px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/623f5025b3c798dec3d11b40_image-offices-dev-webflow-template.png"
                  alt="Offices Worldwide - Dev X Webflow Template"
                  fill
                  priority
                  sizes="(max-width: 479px) 92vw, (max-width: 767px) 94vw, (max-width: 1439px) 57vw, 732px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
