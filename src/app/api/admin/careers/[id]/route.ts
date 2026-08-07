import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedCareer = await prisma.career.update({
      where: {
        id,
      },
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
        responsibilities: body.responsibilities ?? [],
        requirements: body.requirements ?? [],
        preferredQualifications: body.preferredQualifications ?? [],
        hiringProcess: body.hiringProcess ?? [],
        status: body.status,
        featured: body.featured,
      },
    });

    return NextResponse.json(updatedCareer);
  } catch (error) {
    console.error("Update Career Error:", error);

    return NextResponse.json(
      {
        message: "Failed to update career",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.career.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("Delete Career Error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete career",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}