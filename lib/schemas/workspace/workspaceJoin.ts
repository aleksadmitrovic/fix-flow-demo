import z from 'zod';

export const workspaceJoinSchema = z.object({
  joinCode: z.string(),
});

export type WorkspaceJoinSchema = z.infer<typeof workspaceJoinSchema>;
