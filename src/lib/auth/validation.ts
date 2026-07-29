import { z } from "zod";

// Base schemas
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// User Signup Schema
export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(15, "Username cannot exceed 15 characters"),
  password: passwordSchema,
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["user", "admin"]),
  rememberMe: z.boolean().optional(),
});

// Admin Registration Schema
export const adminRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: passwordSchema,
  phone: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Enter a valid email address").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  phone: z.string().optional().nullable(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
});