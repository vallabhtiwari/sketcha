import z from "zod";

export const userSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const userSigninSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type userSignup = z.infer<typeof userSignupSchema>;
