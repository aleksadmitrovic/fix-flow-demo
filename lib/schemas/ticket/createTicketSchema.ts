import z from 'zod';
import { baseTicketSchema } from './baseTicketSchema';

export const createTicketSchema = baseTicketSchema;

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
