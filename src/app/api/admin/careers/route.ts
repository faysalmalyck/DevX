import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const careers = await prisma.career.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(careers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const career = await prisma.career.create({
      data: {
        title: body.title,
        slug: body.slug,
        department: body.department,
        category: body.category,
        location: body.location,
        employmentType: body.employmentType,
        workMode: body.workMode,
        experience: body.experience,
        shortDescription: body.shortDescription,
        overview: body.overview,
        responsibilities: body.responsibilities,
        requirements: body.requirements,
        preferredQualifications: body.preferredQualifications,
        hiringProcess: body.hiringProcess,
        status: body.status ?? "Draft",
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json(career, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create career" },
      { status: 500 }
    );
  }
}