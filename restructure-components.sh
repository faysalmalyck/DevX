#!/bin/bash
set -e
cd "src/components"

mv Home home
mv "home/Artical slider" home/article-slider
mv home/CaseStudy home/case-study
mv home/Techstack home/techstack
mv home/ReadytoContact home/ready-to-contact
mv home/Develeopment home/development
mv home/Testimonals home/testimonials
mv home/AgileDev home/agile-dev
mv home/Process home/process
mv home/Hero home/hero

mv home/article-slider/page.tsx home/article-slider/ArticleSlider.tsx
mv home/case-study/casestudy.tsx home/case-study/CaseStudy.tsx
mv home/techstack/techstack.tsx home/techstack/TechStack.tsx
mv home/development/development.tsx home/development/Development.tsx
mv home/testimonials/testimonals.tsx home/testimonials/Testimonials.tsx
mv home/agile-dev/agile.tsx home/agile-dev/Agile.tsx

mv Auth auth
mv auth/SignIn auth/sign-in
mv auth/SignUp auth/sign-up
mv auth/AuthDialog auth/auth-dialog

mv Contact contact
mv contact/SocialLinks contact/social-links
mv contact/FAQ contact/faq

mv Team team

mv Layout layout
mv layout/Footer layout/footer
mv layout/Header layout/header
mv layout/header/Navigation layout/header/navigation
mv layout/header/Logo layout/header/logo

mv SharedComponent shared
mv Common/* shared/
rmdir Common

mv NotFound not-found
mv not-found/notfound.tsx not-found/NotFound.tsx

mv Breadcrumb breadcrumb

echo "Component restructuring complete."
