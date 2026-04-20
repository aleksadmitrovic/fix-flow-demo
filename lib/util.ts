import { format } from 'date-fns';
import { MemberAssignableRole } from '@/types';
import { Priority, TicketStatus } from './generated/prisma/enums';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdOutlineHorizontalRule } from 'react-icons/md';

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

export function getPriorities() {
  return [
    { value: Priority.HIGH, label: `High` },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.LOW, label: 'Low' },
  ];
}

export function getTicketStatus() {
  return [
    { value: TicketStatus.OPEN, label: 'Open' },
    { value: TicketStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TicketStatus.CLOSED, label: 'Closed' },
  ];
}
