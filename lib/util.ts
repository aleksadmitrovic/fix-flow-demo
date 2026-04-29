import { format } from 'date-fns';
import { MemberAssignableRole } from '@/types';
import { Priority, Role, TicketStatus } from './generated/prisma/enums';
import toast from 'react-hot-toast';

// Date utils functions
export function generateJoinCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatShortDateTime(date: Date) {
  return format(date, 'dd MMM yyyy h:mm:a');
}

export function formatShortDate(date: Date) {
  return format(date, 'dd MMM yyyy');
}

// Role utils functions
export function validateMemberRole(role: MemberAssignableRole) {
  const validRoles: MemberAssignableRole[] = [
    'CLIENT',
    'TECHNICIAN',
    'PENDING',
  ];
  return validRoles.includes(role);
}

export function getMemberRoles() {
  return [
    { value: Role.CLIENT, label: 'Client' },
    { value: Role.TECHNICIAN, label: 'Technician' },
    { value: Role.PENDING, label: 'Pending' },
  ];
}

//  Priorities utils functions
export function getPriorities() {
  return [
    { value: Priority.HIGH, label: `High` },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.LOW, label: 'Low' },
  ];
}

//  Status utils functions
export function getTicketStatus() {
  return [
    { value: TicketStatus.OPEN, label: 'Open' },
    { value: TicketStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TicketStatus.CLOSED, label: 'Closed' },
  ];
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
}
