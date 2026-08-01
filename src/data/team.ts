export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  department: "Leadership" | "Engineering" | "Sales & Growth";
  visible: boolean;
};

export const TEAM_STORAGE_KEY = "DevX-team-members";

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "faysal-mushtaq",
    name: "Faysal Mushtaq",
    role: "CEO & Founder",
    description: "Leading the company with strategic vision, innovation, and a commitment to sustainable growth. Guiding teams and strategy to deliver exceptional digital solutions and lasting client value.",
    image: "/images/hero/faysal.png",
    department: "Leadership",
    visible: true,
  },
  {
    id: "barkat",
    name: "Barkat",
    role: "CTO & Sr. Software Engineer",
    description: "Leading engineering teams to build secure, scalable, and high performance software.",
    image: "/images/hero/barkat.jpg",
    department: "Engineering",
    visible: true,
  },
  {
    id: "raja-saad-raza",
    name: "Raja Saad Raza",
    role: "iOS App Engineer",
    description: "Developing high performance iOS apps for every stage of growth.",
    image: "/images/hero/saad.png",
    department: "Engineering",
    visible: true,
  },
  {
    id: "usama-ishaq",
    name: "Usama Ishaq",
    role: "Android/iOS App Engineer",
    description: "Designing responsive Android apps that deliver exceptional experiences.",
    image: "/images/hero/usama.png",
    department: "Engineering",
    visible: true,
  },
  {
    id: "saqib-mushtaq",
    name: "Saqib Mushtaq",
    role: "Account Executive (EdTech)",
    description: "Helping education partners achieve growth through tailored technology solutions.",
    image: "/images/hero/saqib.png",
    department: "Sales & Growth",
    visible: true,
  },
  {
    id: "afzal-ashraf",
    name: "Afzal Ashraf",
    role: "Account Executive",
    description: "Manages enterprise client success, product positioning, and strategic alignment.",
    image: "/images/hero/afzal.png",
    department: "Sales & Growth",
    visible: true,
  },
  
];

export const departments: TeamMember["department"][] = [
  "Leadership",
  "Engineering",
  "Sales & Growth",
];
