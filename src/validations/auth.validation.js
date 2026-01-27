import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

// signIn validation schema
export const signinSchema = z.object({
  body: z.object({
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128),
  }),
});
