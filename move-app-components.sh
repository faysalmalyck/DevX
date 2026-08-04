#!/bin/bash
set -e
mkdir -p src/components/about
mkdir -p src/components/core-values
mkdir -p src/components/blog
mkdir -p src/components/careers
mkdir -p src/components/pricing
mkdir -p src/components/auth

# About
if [ -d "src/app/(site)/about/Count" ]; then
  mv src/app/(site)/about/Count/Counter.tsx src/components/about/Counter.tsx
  rmdir src/app/(site)/about/Count
fi

# Team (We already have src/components/team)
if [ -f "src/app/(site)/team/TeamPage.tsx" ]; then
  mv src/app/(site)/team/TeamPage.tsx src/components/team/TeamPage.tsx
fi

# Core Values
if [ -f "src/app/(site)/core-values/CoreValue.tsx" ]; then
  mv src/app/(site)/core-values/CoreValue.tsx src/components/core-values/CoreValue.tsx
fi

# Blog
if [ -f "src/app/(site)/blog/FeaturedPostsSection.tsx" ]; then
  mv src/app/(site)/blog/FeaturedPostsSection.tsx src/components/blog/FeaturedPostsSection.tsx
fi
if [ -f "src/app/(site)/blog/LatestArticlesSection.tsx" ]; then
  mv src/app/(site)/blog/LatestArticlesSection.tsx src/components/blog/LatestArticlesSection.tsx
fi

# Careers
if [ -d "src/app/(site)/careers/jobs" ]; then
  mv src/app/(site)/careers/jobs/jobpage.tsx src/components/careers/JobPage.tsx
  rmdir src/app/(site)/careers/jobs
fi

# Pricing
if [ -d "src/app/(site)/pricing/addtocart" ]; then
  mv src/app/(site)/pricing/addtocart/AddToCartCard.tsx src/components/pricing/AddToCartCard.tsx
  rmdir src/app/(site)/pricing/addtocart
fi

# Login / Auth
if [ -f "src/app/(site)/login/LoginCard.tsx" ]; then
  mv src/app/(site)/login/LoginCard.tsx src/components/auth/LoginCard.tsx
  mv src/app/(site)/login/ForgotPasswordCard.tsx src/components/auth/ForgotPasswordCard.tsx
  mv src/app/(site)/login/ResetPasswordCard.tsx src/components/auth/ResetPasswordCard.tsx
fi

echo "App components moved."
