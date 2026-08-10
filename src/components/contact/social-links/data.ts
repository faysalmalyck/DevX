import type { IconType } from 'react-icons';
import { 
  FaLinkedin, 
  FaGithub, 
  FaFacebook, 
  FaXTwitter, 
  FaInstagram, 
  FaYoutube 
} from 'react-icons/fa6';

export interface SocialPlatform {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: IconType;
  colorHex?: string;
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Connect with us for professional updates and industry insights.',
    url: 'https://linkedin.com',
    icon: FaLinkedin,
    colorHex: 'hover:border-brand/50 hover:bg-brand/5',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Explore our open-source projects and code repositories.',
    url: 'https://github.com',
    icon: FaGithub,
    colorHex: 'hover:border-slate-400/50 hover:bg-slate-400/5',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    description: 'Follow us for quick updates, news, and community discussions.',
    url: 'https://x.com',
    icon: FaXTwitter,
    colorHex: 'hover:border-sky-500/50 hover:bg-sky-500/5',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Join our community for company news and event highlights.',
    url: 'https://facebook.com',
    icon: FaFacebook,
    colorHex: 'hover:border-brand/50 hover:bg-brand/5',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'See behind the scenes and our company culture.',
    url: 'https://instagram.com',
    icon: FaInstagram,
    colorHex: 'hover:border-pink-500/50 hover:bg-pink-500/5',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Watch our tutorials, webinars, and tech talks.',
    url: 'https://youtube.com',
    icon: FaYoutube,
    colorHex: 'hover:border-red-500/50 hover:bg-red-500/5',
  },
];