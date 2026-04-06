import z from 'zod';

export const workspaceCreateSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters',
  }),
});

export type WorkspaceCreateSchema = z.infer<typeof workspaceCreateSchema>;
