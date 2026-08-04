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

  // Header / Footer
  content = content.replace(/@\/components\/layout\/Header/gi, '@/components/layout/header');
  content = content.replace(/@\/components\/layout\/Footer/gi, '@/components/layout/footer');
  content = content.replace(/@\/components\/home\/Hero/gi, '@/components/home/hero');
  content = content.replace(/@\/components\/home\/Process/gi, '@/components/home/process');
  
  // Ready to contact
  content = content.replace(/home\/ReadytoContact\/Ready/gi, 'home/ready-to-contact/Ready');

  // Auth Dialog
  content = content.replace(/@\/components\/Auth\/AuthDialog/gi, '@/components/auth/auth-dialog');
  content = content.replace(/auth\/AuthDialog/gi, 'auth/auth-dialog');
  
  // Contexts
  content = content.replace(/\.\/context\/AuthDialogContext/g, '@/contexts/AuthDialogContext');
  content = content.replace(/\.\/context\/SessionContext/g, '@/contexts/SessionContext');

  // FAQ
  content = content.replace(/@\/components\/contact\/FAQ/gi, '@/components/contact/faq');
  
  // Cart
  content = content.replace(/\.\/CartContext/g, '@/contexts/CartContext');

  // Breadcrumb
  content = content.replace(/@\/components\/Breadcrumb/gi, '@/components/breadcrumb');

  // Some components moved to components feature folders
  content = content.replace(/\.\/FeaturedPostsSection/g, '@/components/blog/FeaturedPostsSection');
  content = content.replace(/\.\/LatestArticlesSection/g, '@/components/blog/LatestArticlesSection');
  content = content.replace(/\.\/jobs\/jobpage/g, '@/components/careers/JobPage');
  content = content.replace(/@\/app\/\(site\)\/pricing\/addtocart\/AddToCartCard/g, '@/components/pricing/AddToCartCard');
  content = content.replace(/\.\/LoginCard/g, '@/components/auth/LoginCard');
  content = content.replace(/@\/app\/\(site\)\/team\/TeamPage/g, '@/components/team/TeamPage');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    count++;
  }
}
console.log(`Updated imports in ${count} files.`);
