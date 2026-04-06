import { format } from 'date-fns';
import { MemberAssignableRole } from '@/types';

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
