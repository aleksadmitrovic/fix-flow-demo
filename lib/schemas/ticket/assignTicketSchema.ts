import z from 'zod';

export const assignTicketSchema = z.object({
  workspaceId: z.string(),
  scheduleAt: z.iso.datetime({ local: true }),
});

export type AssignTicketSchema = z.infer<typeof assignTicketSchema>;
