import { Role, TicketStatus } from '@/lib/generated/prisma/client';

export function canCloseTicket(role: Role, assignedToId?: string | null) {
  return role === 'TECHNICIAN' && !!assignedToId;
}
export function canOpenTicket(role: Role, ticketStatus: TicketStatus) {
  return role === 'CLIENT' && ticketStatus === 'CLOSED';
}
