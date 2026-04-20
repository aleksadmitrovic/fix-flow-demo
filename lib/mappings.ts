import {
  MemberWithUserPayload,
  MemberWithWorkspacePayload,
  TicketWithMembershipPayload,
} from '@/types';
import { formatShortDate, formatShortDateTime } from './util';
import { Ticket } from './generated/prisma/client';

export function mapMembershipToMembershipDto(
  membership: MemberWithWorkspacePayload,
) {
  return {
    id: membership.id,
    role: membership.role,
    workspaceId: membership.workspace.id,
    workspaceName: membership.workspace.name,
    workspaceCreatedAt: formatShortDate(membership.workspace.createdAt),
  };
}

export function mapMembershipToMembershipUserDto(
  membership: MemberWithUserPayload,
) {
  return {
    id: membership.id,
    role: membership.role,
    userId: membership.user.id,
    userName: membership.user.name,
    userEmail: membership.user.email,
  };
}

export function mapTicketToTicketDto(ticket: TicketWithMembershipPayload) {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    memberRole: ticket.createdBy.role,
    createdBy: ticket.createdBy.user.name,
    workspaceName: ticket.workspace.name,
    assignedTo: ticket.assignedTo?.user.name,
    scheduleAt: ticket.scheduleAt
      ? formatShortDateTime(ticket.scheduleAt)
      : null,
    completedAt: ticket.completedAt
      ? formatShortDateTime(ticket.completedAt)
      : null,
    updatedAt: formatShortDateTime(ticket.updatedAt),
    createdAt: formatShortDateTime(ticket.createdAt),
  };
}
