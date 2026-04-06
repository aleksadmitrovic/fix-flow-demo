import { MemberWithUserPayload, MemberWithWorkspacePayload } from '@/types';
import { formatShortDate } from './util';

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
