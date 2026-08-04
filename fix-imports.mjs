import fs from 'fs';
import path from 'path';

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const files = getFiles('./src');

let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Replacements
  content = content.replace(/@\/components\/Home\//g, '@/components/home/');
  content = content.replace(/@\/components\/Auth\//g, '@/components/auth/');
  content = content.replace(/@\/components\/Contact\//g, '@/components/contact/');
  content = content.replace(/@\/components\/Layout\//g, '@/components/layout/');
  content = content.replace(/@\/components\/Team\//g, '@/components/team/');
  content = content.replace(/@\/components\/Breadcrumb/g, '@/components/breadcrumb');
  content = content.replace(/@\/components\/NotFound/g, '@/components/not-found');
  content = content.replace(/@\/components\/SharedComponent\//g, '@/components/shared/');
  content = content.replace(/@\/components\/Common\//g, '@/components/shared/');

  // Layout paths
  content = content.replace(/..\/Header\/Navigation\/menuData/g, '@/components/layout/header/navigation/menuData');
  content = content.replace(/..\/Header\/Navigation\/HeaderLink/g, '@/components/layout/header/navigation/HeaderLink');
  content = content.replace(/..\/Header\/Navigation\/MobileHeaderLink/g, '@/components/layout/header/navigation/MobileHeaderLink');
  content = content.replace(/\.\/Logo/g, '@/components/layout/header/logo');
  content = content.replace(/@\/components\/Layout\/Header\/Logo/g, '@/components/layout/header/logo');

  // FAQ Paths
  content = content.replace(/\.\/data/g, './data'); 
  content = content.replace(/\.\/AccordionItem/g, './AccordionItem');

  // Contexts
  content = content.replace(/@\/app\/context\/AuthDialogContext/g, '@/contexts/AuthDialogContext');
  content = content.replace(/@\/app\/context\/SessionContext/g, '@/contexts/SessionContext');
  content = content.replace(/@\/components\/cart\/CartContext/g, '@/contexts/CartContext');
  content = content.replace(/\.\/CartContext/g, '@/contexts/CartContext');

  // DB
  content = content.replace(/@\/lib\/Prisma/g, '@/lib/db/prisma');

  // Renamed files
  content = content.replace(/home\/CaseStudy\/casestudy/g, 'home/case-study/CaseStudy');
  content = content.replace(/home\/Techstack\/techstack/g, 'home/techstack/TechStack');
  content = content.replace(/home\/Develeopment\/development/g, 'home/development/Development');
  content = content.replace(/home\/Testimonals\/testimonals/g, 'home/testimonials/Testimonials');
  content = content.replace(/home\/AgileDev\/agile/g, 'home/agile-dev/Agile');
  content = content.replace(/home\/Artical slider\/page/g, 'home/article-slider/ArticleSlider');
  content = content.replace(/auth\/SignIn/g, 'auth/sign-in');
  content = content.replace(/auth\/SignUp/g, 'auth/sign-up');
  content = content.replace(/auth\/AuthDialog/g, 'auth/auth-dialog');
  
  // Some lowercase references to techstack etc might have been replaced to lowercase above, let's fix the file references.
  content = content.replace(/home\/case-study\/casestudy/g, 'home/case-study/CaseStudy');
  content = content.replace(/home\/techstack\/techstack/g, 'home/techstack/TechStack');
  content = content.replace(/home\/development\/development/g, 'home/development/Development');
  content = content.replace(/home\/testimonials\/testimonals/g, 'home/testimonials/Testimonials');
  content = content.replace(/home\/agile-dev\/agile/g, 'home/agile-dev/Agile');
  content = content.replace(/home\/article-slider\/page/g, 'home/article-slider/ArticleSlider');

  // Utils
  content = content.replace(/@\/utils\/aos/g, '@/providers/AOSProvider');

  if (content !== original) {
    fs.writeFileSync(file, content);
    count++;
  }
}

console.log(`Updated imports in ${count} files.`);
