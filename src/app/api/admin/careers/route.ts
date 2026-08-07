import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(careers);
  } catch (error) {
    console.error("Fetch Careers Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch careers",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.title ||
      !body.slug ||
      !body.department ||
      !body.location
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const existingCareer = await prisma.career.findUnique({
      where: {
        slug: body.slug,
      },
    });

    if (existingCareer) {
      return NextResponse.json(
        {
          message: "A career with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const career = await prisma.career.create({
      data: {
        title: body.title,
        slug: body.slug,
        department: body.department,
        category: body.category ?? "",
        location: body.location,
        employmentType: body.employmentType ?? "",
        workMode: body.workMode ?? "",
        experience: body.experience ?? "",
        shortDescription: body.shortDescription ?? "",
        overview: body.overview ?? "",
        responsibilities: body.responsibilities ?? [],
        requirements: body.requirements ?? [],
        preferredQualifications:
          body.preferredQualifications ?? [],
        hiringProcess: body.hiringProcess ?? [],
        status: body.status ?? "Draft",
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json(career, {
      status: 201,
    });
  } catch (error) {
    console.error("Create Career Error:", error);

    return NextResponse.json(
      {
        message: "Unable to create career",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}