export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  slug: string;
  department?: string;
  visible?: boolean;
  socials?: {
    facebook?: string;
    twitter?: string;
    github?: string;
  };
}

export const TEAM_STORAGE_KEY = "devx_team_members";

export const departments = [
  "Executive",
  "Engineering",
  "Mobile",
  "Sales",
  "Marketing",
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Faysal Mushtaq",
    role: "Chief Executive Officer",
    bio: "Leading the company with strategic vision, innovation, and a commitment to sustainable growth. Guiding teams and strategy to deliver exceptional digital solutions and lasting client value.",
    imageUrl: "/images/hero/faysal.png",
    slug: "faysal-mushtaq",
    department: "Executive",
    visible: true,
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
  {
    id: "2",
    name: "Barkat Ullah",
    role: "Chief Technology Officer",
    bio: "Directing technology strategy, leading R&D, and ensuring the delivery of robust, scalable technical solutions. Drives innovation and technical excellence across all projects.",
    imageUrl: "/images/hero/barkat.jpg",
    slug: "barkat-ullah",
    department: "Executive",
    visible: true,
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
  {
    id: "3",
    name: "Saad",
    role: "iOS App Developer",
    bio: "Creating seamless, high-performance iOS applications with a focus on user experience and functionality. Skilled in Swift, SwiftUI, and mobile architecture to deliver polished, reliable apps.",
    imageUrl: "/images/hero/saad.png",
    slug: "saad",
    department: "Mobile",
    visible: true,
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
  {
    id: "4",
    name: "Usama",
    role: "iOS/Android App Engineer",
    bio: "Developing cross-platform mobile applications for both iOS and Android. Skilled in building high-quality, user-focused mobile experiences using Flutter and other relevant technologies.",
    imageUrl: "/images/hero/usama.png",
    slug: "usama",
    department: "Mobile",
    visible: true,
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
  {
    id: "5",
    name: "Afzal Ashraf",
    role: "Account Executive",
    bio: "Leveraging strong communication and negotiation skills to build lasting client relationships. Drives business growth through strategic account management and exceptional service delivery.",
    imageUrl: "/images/hero/afzal.png",
    slug: "afzal-ashraf",
    department: "Sales",
    visible: true,
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
  {
    id: "6",
    name: "Saqib Mushtaq",
    role: "SEO Specialist",
    bio: "Drives business growth through strategic SEO strategies, content optimization, and advanced analytics to enhance online visibility and search rankings.",
    imageUrl: "/images/hero/saqib.png",
    slug: "saqib-mushtaq",
    department: "Marketing",
    visible: true,
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
];

export const getTeamMemberBySlug = (slug: string): TeamMember | undefined => {
  if (!slug) return undefined;
  return teamMembers.find((member) => member.slug.toLowerCase().trim() === slug.toLowerCase().trim());
};