import z from 'zod';
import { baseTicketSchema } from './baseTicketSchema';

export const updateTicketSchema = baseTicketSchema.extend({
  id: z.string(),
});

export type UpdateTicketSchema = z.infer<typeof updateTicketSchema>;
