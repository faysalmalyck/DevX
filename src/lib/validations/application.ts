import { z } from "zod";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_RESUME_TYPES = [
  {
    extension: "pdf",
    mimeType: "application/pdf",
  },
  {
    extension: "doc",
    mimeType: "application/msword",
  },
  {
    extension: "docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
] as const;

export type ResumeExtension = (typeof ACCEPTED_RESUME_TYPES)[number]["extension"];
export type ResumeMimeType = (typeof ACCEPTED_RESUME_TYPES)[number]["mimeType"];

export interface ResumeFileInput {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export interface ValidatedResume {
  contents: Uint8Array;
  extension: ResumeExtension;
  mimeType: ResumeMimeType;
  originalFilename: string;
  size: number;
}

export type ResumeValidationResult =
  | { success: true; data: ValidatedResume }
  | { success: false; message: string };

const INVALID_RESUME_MESSAGE =
  "Upload a PDF, DOC, or DOCX resume no larger than 5 MB.";

const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function cleanSingleLine(value: string): string {
  return value
    .normalize("NFKC")
    .replace(controlCharacters, "")
    .replace(/[\t\r\n]+/g, " ")
    .trim();
}

function cleanMultiline(value: string): string {
  return value
    .normalize("NFKC")
    .replace(controlCharacters, "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const optionalHttpUrl = z
  .string()
  .transform(cleanSingleLine)
  .pipe(z.string().max(2048, "URL must be 2,048 characters or fewer."))
  .transform((value) => (value.length === 0 ? undefined : value))
  .refine(
    (value) => value === undefined || isHttpUrl(value),
    "Enter a valid http or https URL."
  );

export const applicationSubmissionSchema = z.object({
  fullName: z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(2, "Enter your full name.")
        .max(120, "Full name must be 120 characters or fewer.")
    ),
  email: z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(1, "Enter your email address.")
        .max(254, "Email address must be 254 characters or fewer.")
        .email("Enter a valid email address.")
    )
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(7, "Enter a valid phone number.")
        .max(32, "Phone number must be 32 characters or fewer.")
        .regex(/^[0-9+().\-\s]+$/, "Enter a valid phone number.")
    ),
  currentLocation: z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(2, "Enter your current location.")
        .max(160, "Location must be 160 characters or fewer.")
    ),
  yearsOfExperience: z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .regex(/^\d{1,2}$/, "Enter whole years of experience from 0 to 60.")
    )
    .transform(Number)
    .pipe(
      z
        .number()
        .int("Enter whole years of experience.")
        .min(0, "Years of experience cannot be negative.")
        .max(60, "Years of experience must be 60 or fewer.")
    ),
  linkedInUrl: optionalHttpUrl,
  portfolioUrl: optionalHttpUrl,
  coverLetter: z
    .string()
    .transform(cleanMultiline)
    .pipe(
      z
        .string()
        .min(10, "Enter a short cover letter or message.")
        .max(5000, "Cover letter must be 5,000 characters or fewer.")
    ),
  privacyConsent: z.literal(true, {
    error: "You must agree to the privacy notice before submitting.",
  }),
});

export type ApplicationSubmission = z.infer<typeof applicationSubmissionSchema>;

const resumeMetadataSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().transform((value) => value.trim().toLowerCase()),
  size: z.number().finite().int().positive().max(MAX_RESUME_BYTES),
});

function resumeTypeForExtension(
  extension: string
): (typeof ACCEPTED_RESUME_TYPES)[number] | undefined {
  return ACCEPTED_RESUME_TYPES.find((resumeType) => {
    return resumeType.extension === extension;
  });
}

function extensionFromFilename(filename: string): string | undefined {
  const normalizedFilename = filename.replace(/\\/g, "/").split("/").pop();
  if (!normalizedFilename) return undefined;

  const extensionIndex = normalizedFilename.lastIndexOf(".");
  if (extensionIndex <= 0 || extensionIndex === normalizedFilename.length - 1) {
    return undefined;
  }

  return normalizedFilename.slice(extensionIndex + 1).toLowerCase();
}

export function sanitizeResumeFilename(filename: string): string {
  const normalizedFilename =
    filename.replace(/\\/g, "/").split("/").pop()?.normalize("NFKD") ?? "";
  const extension = extensionFromFilename(normalizedFilename)?.replace(/[^a-z0-9]/g, "");
  const baseName = extension
    ? normalizedFilename.slice(0, normalizedFilename.lastIndexOf("."))
    : normalizedFilename;
  const safeBaseName = baseName
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/[-_]{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 100);
  const fallbackBaseName = safeBaseName || "resume";

  return extension ? `${fallbackBaseName}.${extension}` : fallbackBaseName;
}

function matchesBytesAt(
  bytes: Uint8Array,
  offset: number,
  expected: readonly number[]
): boolean {
  if (offset < 0 || offset + expected.length > bytes.length) return false;

  return expected.every((value, index) => bytes[offset + index] === value);
}

function hasPdfSignature(bytes: Uint8Array): boolean {
  const signature = [0x25, 0x50, 0x44, 0x46, 0x2d] as const; // %PDF-
  const maximumOffset = Math.min(1024, bytes.length - signature.length);

  for (let offset = 0; offset <= maximumOffset; offset += 1) {
    if (matchesBytesAt(bytes, offset, signature)) return true;
  }

  return false;
}

function hasLegacyDocSignature(bytes: Uint8Array): boolean {
  return matchesBytesAt(bytes, 0, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
}

function hasZipSignature(bytes: Uint8Array): boolean {
  return matchesBytesAt(bytes, 0, [0x50, 0x4b, 0x03, 0x04]);
}

function readUint16(view: DataView, offset: number): number | undefined {
  if (offset < 0 || offset + 2 > view.byteLength) return undefined;
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number | undefined {
  if (offset < 0 || offset + 4 > view.byteLength) return undefined;
  return view.getUint32(offset, true);
}

function hasDocxCentralDirectory(bytes: Uint8Array): boolean {
  if (!hasZipSignature(bytes) || bytes.byteLength < 22) return false;

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const endOfCentralDirectorySignature = 0x06054b50;
  const centralDirectorySignature = 0x02014b50;
  const minimumEndOfCentralDirectoryOffset = Math.max(0, bytes.byteLength - 65_557);
  let endOfCentralDirectoryOffset = -1;

  for (let offset = bytes.byteLength - 22; offset >= minimumEndOfCentralDirectoryOffset; offset -= 1) {
    if (readUint32(view, offset) === endOfCentralDirectorySignature) {
      endOfCentralDirectoryOffset = offset;
      break;
    }
  }

  if (endOfCentralDirectoryOffset === -1) return false;

  const entryCount = readUint16(view, endOfCentralDirectoryOffset + 10);
  const centralDirectorySize = readUint32(view, endOfCentralDirectoryOffset + 12);
  const centralDirectoryOffset = readUint32(view, endOfCentralDirectoryOffset + 16);

  if (
    entryCount === undefined ||
    centralDirectorySize === undefined ||
    centralDirectoryOffset === undefined ||
    centralDirectoryOffset + centralDirectorySize > bytes.byteLength
  ) {
    return false;
  }

  const centralDirectoryEnd = centralDirectoryOffset + centralDirectorySize;
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let cursor = centralDirectoryOffset;
  let contentTypesFound = false;
  let documentFound = false;

  for (let index = 0; index < entryCount && cursor < centralDirectoryEnd; index += 1) {
    if (readUint32(view, cursor) !== centralDirectorySignature) return false;

    const filenameLength = readUint16(view, cursor + 28);
    const extraLength = readUint16(view, cursor + 30);
    const commentLength = readUint16(view, cursor + 32);

    if (
      filenameLength === undefined ||
      extraLength === undefined ||
      commentLength === undefined
    ) {
      return false;
    }

    const filenameStart = cursor + 46;
    const nextCursor = filenameStart + filenameLength + extraLength + commentLength;
    if (nextCursor > centralDirectoryEnd || filenameStart + filenameLength > bytes.byteLength) {
      return false;
    }

    const filename = decoder.decode(bytes.subarray(filenameStart, filenameStart + filenameLength));
    if (filename === "[Content_Types].xml") contentTypesFound = true;
    if (filename === "word/document.xml") documentFound = true;

    cursor = nextCursor;
  }

  return contentTypesFound && documentFound;
}

function hasExpectedFileSignature(
  extension: ResumeExtension,
  bytes: Uint8Array
): boolean {
  switch (extension) {
    case "pdf":
      return hasPdfSignature(bytes);
    case "doc":
      return hasLegacyDocSignature(bytes);
    case "docx":
      return hasDocxCentralDirectory(bytes);
  }
}

export function isResumeFileInput(
  value: unknown
): value is ResumeFileInput {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.size === "number" &&
    typeof candidate.arrayBuffer === "function"
  );
}

export async function validateResumeFile(
  file: ResumeFileInput
): Promise<ResumeValidationResult> {
  const metadata = resumeMetadataSchema.safeParse({
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (!metadata.success) {
    return { success: false, message: INVALID_RESUME_MESSAGE };
  }

  const extension = extensionFromFilename(metadata.data.name);
  const resumeType = extension ? resumeTypeForExtension(extension) : undefined;
  // Browser-provided MIME metadata is advisory. We accept an omitted value
  // only when the filename extension and binary signature both match below.
  if (
    !resumeType ||
    (metadata.data.type.length > 0 && metadata.data.type !== resumeType.mimeType)
  ) {
    return { success: false, message: INVALID_RESUME_MESSAGE };
  }

  try {
    const contents = new Uint8Array(await file.arrayBuffer());
    if (contents.byteLength !== metadata.data.size) {
      return { success: false, message: INVALID_RESUME_MESSAGE };
    }

    if (!hasExpectedFileSignature(resumeType.extension, contents)) {
      return { success: false, message: INVALID_RESUME_MESSAGE };
    }

    return {
      success: true,
      data: {
        contents,
        extension: resumeType.extension,
        mimeType: resumeType.mimeType,
        originalFilename: sanitizeResumeFilename(metadata.data.name),
        size: metadata.data.size,
      },
    };
  } catch {
    return { success: false, message: INVALID_RESUME_MESSAGE };
  }
}

export function getApplicationFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName === "string" && !fieldErrors[fieldName]) {
      fieldErrors[fieldName] = issue.message;
    }
  }

  return fieldErrors;
}
