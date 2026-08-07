import { CareerStatus, PrismaClient } from "@prisma/client";
import { careersData } from "../src/data/careers.ts";

const prisma = new PrismaClient();

async function main() {
  for (const [index, career] of careersData.entries()) {
    await prisma.career.upsert({
      where: {
        slug: career.slug,
      },

      update: {
        title: career.title,
        department: career.department,
        category: career.category,
        location: career.location,
        employmentType: career.type,
        workMode: career.workMode,
        experience: career.experience,
        shortDescription: career.description,
        overview: career.overview,
        responsibilitiesDescription: career.responsibilitiesDescription,
        responsibilities: career.responsibilities,
        requirementsDescription: career.requirementsDescription,
        requirements: career.requirements,
        preferredQualifications: career.preferredQualifications,
        hiringProcess: career.hiringProcess,
        displayOrder: index + 1,
      },

      create: {
        title: career.title,
        slug: career.slug,
        department: career.department,
        category: career.category,
        location: career.location,
        employmentType: career.type,
        workMode: career.workMode,
        experience: career.experience,
        shortDescription: career.description,
        overview: career.overview,
        responsibilitiesDescription: career.responsibilitiesDescription,
        responsibilities: career.responsibilities,
        requirementsDescription: career.requirementsDescription,
        requirements: career.requirements,
        preferredQualifications: career.preferredQualifications,
        hiringProcess: career.hiringProcess,
        displayOrder: index + 1,
        status: CareerStatus.PUBLISHED,
        featured: false,
        publishedAt: new Date(),
      },
    });
  }

  console.log(`✅ Seeded ${careersData.length} careers.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
