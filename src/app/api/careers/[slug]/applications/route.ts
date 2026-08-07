import { ApplicationStatus, CareerStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { checkApplicationRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { prisma } from "@/lib/db/prisma";
import {
  enqueueCareerResumeCleanup,
  tryDeleteCareerResume,
} from "@/lib/storage/career-resume-cleanup";
import {
  uploadCareerResume,
} from "@/lib/storage/career-resumes";
import {
  MAX_RESUME_BYTES,
  applicationSubmissionSchema,
  getApplicationFieldErrors,
  isResumeFileInput,
  validateResumeFile,
} from "@/lib/validations/application";

export const runtime = "nodejs";

const MAX_MULTIPART_REQUEST_BYTES = MAX_RESUME_BYTES + 256 * 1024;

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function response(
  body: {
    success: boolean;
    message: string;
    code?: string;
    fieldErrors?: Record<string, string>;
  },
  status: number,
  headers?: HeadersInit
): NextResponse {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store");

  return NextResponse.json(body, { status, headers: responseHeaders });
}

function formText(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
}

function hasPrivacyConsent(value: string): boolean {
  return value === "true" || value === "on" || value === "1";
}

function exceedsMultipartRequestLimit(request: NextRequest): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;

  const requestBytes = Number(contentLength);
  return Number.isFinite(requestBytes) && requestBytes > MAX_MULTIPART_REQUEST_BYTES;
}

async function readBoundedMultipartFormData(
  request: NextRequest,
  contentType: string
): Promise<FormData | "too-large" | null> {
  if (exceedsMultipartRequestLimit(request)) return "too-large";

  const reader = request.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_MULTIPART_REQUEST_BYTES) {
        await reader.cancel().catch(() => undefined);
        return "too-large";
      }

      chunks.push(value);
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return await new Request(request.url, {
      method: "POST",
      headers: { "content-type": contentType },
      body,
    }).formData();
  } catch {
    return null;
  }
}

function isDuplicateApplicationError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return false;
  }

  const uniqueTarget = error.meta?.target;
  if (Array.isArray(uniqueTarget)) {
    return uniqueTarget.includes("careerId") && uniqueTarget.includes("email");
  }

  return (
    typeof uniqueTarget === "string" &&
    uniqueTarget.includes("careerId") &&
    uniqueTarget.includes("email")
  );
}

async function removeUploadedResume(storageKey: string): Promise<void> {
  if (await tryDeleteCareerResume(storageKey)) return;

  // Keep failed cleanup durable without storing candidate content or filenames.
  await enqueueCareerResumeCleanup(storageKey).catch(() => undefined);
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const rateLimit = await checkApplicationRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      return response(
        {
          success: false,
          message: "Too many application attempts. Please try again later.",
          code: "RATE_LIMITED",
        },
        429,
        {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1_000)),
        }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
      return response(
        {
          success: false,
          message: "Submit the application form with a resume attachment.",
          code: "UNSUPPORTED_MEDIA_TYPE",
        },
        415
      );
    }

    const formData = await readBoundedMultipartFormData(request, contentType);
    if (formData === "too-large") {
      return response(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          code: "VALIDATION_ERROR",
          fieldErrors: {
            resume: "Resume files must be 5 MB or smaller.",
          },
        },
        422
      );
    }

    if (!formData) {
      return response(
        {
          success: false,
          message: "The application form could not be read. Please try again.",
          code: "INVALID_FORM_DATA",
        },
        400
      );
    }

    // Treat bot-filled honeypots as successful submissions without retaining data.
    if (formText(formData, "website").trim().length > 0) {
      return response(
        {
          success: true,
          message: "Your application has been received.",
        },
        201
      );
    }

    const submission = applicationSubmissionSchema.safeParse({
      fullName: formText(formData, "fullName"),
      email: formText(formData, "email"),
      phone: formText(formData, "phone"),
      currentLocation: formText(formData, "currentLocation"),
      yearsOfExperience: formText(formData, "yearsOfExperience"),
      linkedInUrl: formText(formData, "linkedInUrl"),
      portfolioUrl: formText(formData, "portfolioUrl"),
      coverLetter: formText(formData, "coverLetter"),
      privacyConsent: hasPrivacyConsent(formText(formData, "privacyConsent")),
    });

    if (!submission.success) {
      return response(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          code: "VALIDATION_ERROR",
          fieldErrors: getApplicationFieldErrors(submission.error),
        },
        422
      );
    }

    const { slug } = await params;
    const career = await prisma.career.findUnique({
      where: { slug },
      select: {
        id: true,
        status: true,
      },
    });

    if (!career || career.status !== CareerStatus.PUBLISHED) {
      return response(
        {
          success: false,
          message: "This role is not currently accepting applications.",
          code: "JOB_NOT_AVAILABLE",
        },
        404
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        careerId_email: {
          careerId: career.id,
          email: submission.data.email,
        },
      },
      select: { id: true },
    });

    if (existingApplication) {
      return response(
        {
          success: false,
          message: "An application with this email address has already been submitted for this job.",
          code: "DUPLICATE_APPLICATION",
        },
        409
      );
    }

    const resumeInput = formData.get("resume");
    if (!isResumeFileInput(resumeInput)) {
      return response(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          code: "VALIDATION_ERROR",
          fieldErrors: {
            resume: "Attach your resume as a PDF, DOC, or DOCX file.",
          },
        },
        422
      );
    }

    const validatedResume = await validateResumeFile(resumeInput);
    if (!validatedResume.success) {
      return response(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          code: "VALIDATION_ERROR",
          fieldErrors: {
            resume: validatedResume.message,
          },
        },
        422
      );
    }

    let storageKey: string | undefined;

    try {
      const uploadedResume = await uploadCareerResume(validatedResume.data);
      const uploadedStorageKey = uploadedResume.storageKey;
      storageKey = uploadedStorageKey;

      const createdWhilePublished = await prisma.$transaction(async (tx) => {
        // Lock the job row while checking publication. A concurrent close or
        // archive must resolve before this application can be written.
        const publishedCareer = await tx.$queryRaw<{ id: string }[]>`
          SELECT "id"
          FROM "Career"
          WHERE "id" = ${career.id}
            AND "status" = ${CareerStatus.PUBLISHED}::"CareerStatus"
          FOR UPDATE
        `;

        if (publishedCareer.length === 0) return false;

        await tx.application.create({
          data: {
          careerId: career.id,
          fullName: submission.data.fullName,
          email: submission.data.email,
          phone: submission.data.phone,
          currentLocation: submission.data.currentLocation,
          yearsOfExperience: submission.data.yearsOfExperience,
          linkedinUrl: submission.data.linkedInUrl,
          portfolioUrl: submission.data.portfolioUrl,
          coverLetter: submission.data.coverLetter,
          resumeStorageKey: uploadedStorageKey,
          resumeOriginalFilename: validatedResume.data.originalFilename,
          resumeMimeType: validatedResume.data.mimeType,
          resumeSize: validatedResume.data.size,
          consentConfirmed: submission.data.privacyConsent,
          status: ApplicationStatus.NEW,
          },
        });

        return true;
      });

      if (!createdWhilePublished) {
        await removeUploadedResume(uploadedStorageKey);
        return response(
          {
            success: false,
            message: "This role is not currently accepting applications.",
            code: "JOB_NOT_AVAILABLE",
          },
          404
        );
      }
    } catch (error) {
      if (storageKey) {
        await removeUploadedResume(storageKey);
      }

      if (isDuplicateApplicationError(error)) {
        return response(
          {
            success: false,
            message: "An application with this email address has already been submitted for this job.",
            code: "DUPLICATE_APPLICATION",
          },
          409
        );
      }

      return response(
        {
          success: false,
          message: "We could not submit your application. Please try again.",
          code: "APPLICATION_SUBMISSION_FAILED",
        },
        500
      );
    }

    revalidatePath("/admin/applications");

    return response(
      {
        success: true,
        message: "Your application has been received.",
      },
      201
    );
  } catch {
    return response(
      {
        success: false,
        message: "We could not submit your application. Please try again.",
        code: "APPLICATION_SUBMISSION_FAILED",
      },
      500
    );
  }
}
