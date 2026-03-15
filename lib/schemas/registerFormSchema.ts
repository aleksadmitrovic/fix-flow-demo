import z from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: 'Name must be at least 3 characters',
    }),
    email: z.email(),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
    passwordConfirm: z.string().min(6, {
      message: 'Please confirm password',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
