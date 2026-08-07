import { PrismaClient } from "@prisma/client";
import { careersData } from "../src/data/careers";

const prisma = new PrismaClient();

async function main() {
  for (const career of careersData) {
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
        responsibilities: career.responsibilities,
        requirements: career.requirements,
        preferredQualifications: career.preferredQualifications,
        hiringProcess: career.hiringProcess,
        status: "Published",
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
        responsibilities: career.responsibilities,
        requirements: career.requirements,
        preferredQualifications: career.preferredQualifications,
        hiringProcess: career.hiringProcess,
        status: "Published",
        featured: false,
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