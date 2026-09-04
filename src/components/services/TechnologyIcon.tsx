import type { IconType } from "react-icons";
import {
  SiAngular,
  SiCss,
  SiCplusplus,
  SiDocker,
  SiDotnet,
  SiFlutter,
  SiFirebase,
  SiHubspot,
  SiKotlin,
  SiKubernetes,
  SiLaravel,
  SiMake,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNestjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRuby,
  SiShopify,
  SiStripe,
  SiSupabase,
  SiSwift,
  SiTypescript,
  SiVuedotjs,
  SiWebflow,
  SiWoocommerce,
  SiWordpress,
  SiZapier,
  SiJavascript,
  SiHtml5,
} from "react-icons/si";
import type { TechnologyIconKey } from "@/data/service-technologies";
import { techStack } from "@/data/techstack";

const technologyIcons: Record<TechnologyIconKey, IconType> = {
  wordpress: SiWordpress,
  shopify: SiShopify,
  woocommerce: SiWoocommerce,
  webflow: SiWebflow,
  react: SiReact,
  nextjs: SiNextdotjs,
  angular: SiAngular,
  vue: SiVuedotjs,
  javascript: SiJavascript,
  html5: SiHtml5,
  css3: SiCss,
  nodejs: SiNodedotjs,
  nestjs: SiNestjs,
  dotnet: SiDotnet,
  php: SiPhp,
  laravel: SiLaravel,
  "ruby-on-rails": SiRuby,
  cpp: SiCplusplus,
  typescript: SiTypescript,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  mysql: SiMysql,
  firebase: SiFirebase,
  python: SiPython,
  flutter: SiFlutter,
  swift: SiSwift,
  kotlin: SiKotlin,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  stripe: SiStripe,
  supabase: SiSupabase,
  zapier: SiZapier,
  make: SiMake,
  hubspot: SiHubspot,
};

const techStackIconNames: Partial<Record<TechnologyIconKey, string>> = {
  wordpress: "Wordpress",
  shopify: "shopify",
  woocommerce: "Woocommerce",
  webflow: "webflow",
  react: "React",
  nextjs: "NextJs",
  angular: "Angular",
  vue: "Vue.js",
  javascript: "JavaScript",
  html5: "HTML5",
  css3: "CSS3",
  nodejs: "Node.js",
  nestjs: "NestJS",
  dotnet: ".NET",
  php: "PHP",
  laravel: "Laravel",
  "ruby-on-rails": "Ruby on Rails",
  cpp: "C++",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  mysql: "MySQL",
  firebase: "Firebase",
  python: "Python",
  flutter: "Flutter",
  swift: "Swift",
  kotlin: "Kotlin",
  docker: "Docker",
  kubernetes: "Kubernetes",
  stripe: "Stripe",
  supabase: "Supabase",
  zapier: "Zapier",
};

type TechnologyIconProps = Readonly<{
  icon: TechnologyIconKey;
  className?: string;
}>;

export default function TechnologyIcon({
  icon,
  className = "h-8 w-8 sm:h-10 sm:w-10",
}: TechnologyIconProps) {
  const Icon = technologyIcons[icon];
  const techStackName = techStackIconNames[icon];
  const sourceIcon = techStackName
    ? techStack.find((technology) => technology.name === techStackName)
    : undefined;

  if (sourceIcon) {
    return (
      <img
        src={sourceIcon.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  return <Icon aria-hidden="true" className={className} />;
}
