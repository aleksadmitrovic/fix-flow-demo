import z from 'zod';

export const assignTicketSchema = z.object({
  workspaceId: z.string(),
  scheduleAt: z.iso
    .datetime({ local: true })
    .refine((val) => new Date(val) > new Date(), {
      message: 'Schedule date cannot be in the past',
    }),
});

export type AssignTicketSchema = z.infer<typeof assignTicketSchema>;
