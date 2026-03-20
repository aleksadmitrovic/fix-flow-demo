import z from 'zod';

export const companyJoinSchema = z.object({
  role: z.enum(['CLIENT', 'TEHNICIAN']),
  joinCode: z.string(),
});

export type CompanyJoinSchema = z.infer<typeof companyJoinSchema>;
