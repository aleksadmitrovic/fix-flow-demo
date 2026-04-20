import { Priority } from '@/lib/generated/prisma/enums';
import z from 'zod';

export const baseTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(Priority),
  workspaceId: z.string(),
});
