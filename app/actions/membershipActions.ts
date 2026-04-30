'use server';
import prisma from '@/lib/prisma';
import { mapMembershipToMembershipUserDto } from '@/lib/mappings';
import { validateMemberRole } from '@/lib/util';
import {
  ActionResult,
  MembershipUserDto,
  MemberAssignableRole,
  MembershipRole,
} from '@/types';
import { getServerSession } from './authActions';

export async function getWorkspaceMembersForOwner(
  workspaceId: string,
  page: number = 1,
  limit: number = 5,
): Promise<ActionResult<{ members: MembershipUserDto[]; totalPages: number }>> {
  const session = await getServerSession();

  if (!session) {
    return { status: 'error', error: 'Unauthorized' };
  }

  try {
    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      prisma.membership.findMany({
        where: {
          workspaceId,
          role: { not: 'ADMIN' },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.membership.count({
        where: {
          workspaceId,
          role: { not: 'ADMIN' },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const members = result.map(mapMembershipToMembershipUserDto);

    return { status: 'success', data: { members, totalPages } };
  } catch (error) {
    console.error('getWorkspaceMembersForOwner error:', error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function checkIfMemberExist(memberId: string): Promise<boolean> {
  try {
    const existingMember = await prisma.membership.findUnique({
      where: { id: memberId },
    });
    return !!existingMember;
  } catch (error) {
    console.error(`checkIfMemberExist error:`, error);
    return false;
  }
}

export async function updateMemberRole(
  memberId: string,
  role: MemberAssignableRole,
  workspaceId: string,
): Promise<ActionResult<string>> {
  const session = await getServerSession();
  if (!session) return { status: 'error', error: 'Unauthorized' };

  if (!validateMemberRole(role)) {
    return { status: 'error', error: 'Invalid role' };
  }

  const isAdmin = await isWorkspaceAdmin(workspaceId);
  if (!isAdmin)
    return { status: 'error', error: 'Only admin can change roles' };

  try {
    const result = await prisma.membership.update({
      where: { id: memberId },
      data: { role },
      select: { user: { select: { name: true } } },
    });

    return { status: 'success', data: result.user.name };
  } catch (error) {
    console.error('updateMemberRole error:', error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function removeMemberFromWorkspace(
  memberId: string,
  workspaceId: string,
): Promise<ActionResult<string>> {
  const session = await getServerSession();
  if (!session) return { status: 'error', error: 'Unauthorized' };

  const isAdmin = await isWorkspaceAdmin(workspaceId);
  if (!isAdmin)
    return { status: 'error', error: 'Only admin can remove members' };

  try {
    const result = await prisma.membership.delete({
      where: { id: memberId },
      select: { user: { select: { name: true } } },
    });

    return { status: 'success', data: result.user.name };
  } catch (error) {
    console.error('removeMemberFromWorkspace error:', error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getCurrentMemberOnWorkspace(
  workspaceId: string,
): Promise<ActionResult<MembershipRole>> {
  const session = await getServerSession();
  if (!session?.user) {
    return { status: 'error', error: 'Unauthorized' };
  }

  try {
    const result = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        workspaceId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!result) {
      return {
        status: 'error',
        error: 'User doesnt have role on this workspace',
      };
    }

    return { status: 'success', data: result };
  } catch (error) {
    console.error('getCurrentUserRole error:', error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function isWorkspaceAdmin(workspaceId: string): Promise<boolean> {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return false;
    }

    const result = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
      },
      select: {
        ownerId: true,
      },
    });

    return session.user.id === result?.ownerId;
  } catch (error) {
    console.error(error);
    return false;
  }
}
