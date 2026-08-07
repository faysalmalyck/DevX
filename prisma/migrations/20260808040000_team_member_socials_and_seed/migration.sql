ALTER TABLE "TeamMember"
  ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "twitterUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "githubUrl" TEXT;

-- Preserve the profiles that powered the original public Team page. This is
-- idempotent: an existing database record always wins over the fallback data.
INSERT INTO "TeamMember" (
  "id", "name", "slug", "role", "department", "bio", "image",
  "facebookUrl", "twitterUrl", "githubUrl", "displayOrder", "featured",
  "status", "createdAt", "updatedAt"
)
VALUES
  ('team-faysal-mushtaq', 'Faysal Mushtaq', 'faysal-mushtaq', 'CEO & Founder', 'Executive', 'Leading the company with strategic vision, innovation, and a commitment to sustainable growth.Guiding teams and strategy to deliver exceptional digital solutions and lasting client value.', '/images/hero/faysal.png', 'https://facebook.com', 'https://twitter.com', 'https://github.com', 0, true, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team-barkat-ullah', 'Barkat Ullah', 'barkat-ullah', 'CTO & Sr. Software Engineer', 'Engineering', 'Leading engineering teams to build secure, scalable, and high performance software..', '/images/hero/barkat.jpg', 'https://facebook.com', 'https://twitter.com', 'https://github.com', 1, false, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team-raja-saad-raza', 'Raja Saad Raza', 'raja-saad-raza', 'IOS App Engineer', 'Engineering', 'Developing high performance iOS apps for every stage of growth.', '/images/hero/saad.png', 'https://facebook.com', 'https://twitter.com', 'https://github.com', 2, false, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team-usama-ishaq', 'Usama Ishaq', 'usama-ishaq', 'Andriod/IOS App Engineer', 'Engineering', 'Designing responsive Android apps that deliver exceptional experiences.', '/images/hero/usama.png', 'https://facebook.com', 'https://twitter.com', 'https://github.com', 3, false, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team-saqib-mushtaq', 'Saqib Mushtaq', 'saqib-mushtaq', 'Account Executive (EdTech)', 'Sales', 'Helping education partners achieve growth through tailored technology solutions.', '/images/hero/saqib.png', 'https://facebook.com', 'https://twitter.com', 'https://github.com', 4, false, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team-arshad-nazir', 'Arshad Nazir', 'arshad-nazir', 'General Manager', 'Sales', 'Developing and executing sales strategies esponsible for leading the entire sales function of an organization. Typical responsibilities.', NULL, 'https://facebook.com', 'https://twitter.com', 'https://github.com', 5, false, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team-afzal-ashraf', 'Afzal Ashraf', 'afzal-ashraf', 'Account Executive', 'Sales', 'Manages enterprise client success, product positioning, and strategic alignment.', '/images/hero/afzal.png', 'https://facebook.com', 'https://twitter.com', 'https://github.com', 6, false, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;
