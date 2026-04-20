'use server';
import { Workspace } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { generateJoinCode } from '@/lib/util';
import { ActionResult, MembershipWorkspaceDto } from '@/types';
import { getServerSession } from './authActions';
import {
  workspaceCreateSchema,
  WorkspaceCreateSchema,
} from '@/lib/schemas/workspace/workspaceCreate';
import { mapMembershipToMembershipDto } from '@/lib/mappings';
import {
  workspaceJoinSchema,
  WorkspaceJoinSchema,
} from '@/lib/schemas/workspace/workspaceJoin';

async function createUniqueJoinCode(): Promise<string> {
  let code = '';
  let exists = true;
  while (exists) {
    code = generateJoinCode(10);
    const company = await prisma.workspace.findUnique({
      where: { joinCode: code },
    });
    exists = company !== null;
  }

  return code;
}

export async function getAllWorkspacesByUserId(
  id: string,
): Promise<ActionResult<MembershipWorkspaceDto[]>> {
  try {
    const memberships = await prisma.membership.findMany({
      where: { userId: id },
      select: {
        id: true,
        role: true,
        workspace: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    const membershipToReturn = memberships.map(mapMembershipToMembershipDto);

    return { status: 'success', data: membershipToReturn };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getWorkspacesForCurrentUser(): Promise<
  ActionResult<MembershipWorkspaceDto[]>
> {
  const session = await getServerSession();

  if (!session?.user) {
    return { status: 'error', error: 'Unauthorized' };
  }

  try {
    const result = await getAllWorkspacesByUserId(session.user.id);

    if (result.status === 'error') {
      return { status: 'error', error: result.error };
    }

    return {
      status: 'success',
      data: result.data,
    };
  } catch (error) {
    console.error('getWorkspacesForCurrentUser error', error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function createWorkspace(
  data: WorkspaceCreateSchema,
): Promise<ActionResult<Workspace>> {
  const validated = workspaceCreateSchema.safeParse(data);

  if (!validated.success) {
    return { status: 'error', error: validated.error.issues };
  }

  const session = await getServerSession();
  if (!session) return { status: 'error', error: 'Unauthorized' };
  const userId = session.user.id;

  try {
    const joinCode = await createUniqueJoinCode();

    const workspace = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: data.name,
          joinCode,
          ownerId: userId,
        },
      });

      await tx.membership.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: 'ADMIN',
        },
      });

      return workspace;
    });

    return { status: 'success', data: workspace };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function validateWorkspaceJoin(userId: string, joinCode: string) {
  const workspace = await prisma.workspace.findFirst({
    where: { joinCode },
  });

  if (!workspace) {
    return {
      ok: false,
      error: 'Invalid join code. Please try again.',
    };
  }

  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId,
      workspaceId: workspace.id,
    },
  });

  if (existingMembership) {
    return {
      ok: false,
      error: 'You are already a member of this workspace',
    };
  }

  return {
    ok: true,
    workspace,
  };
}

export async function joinWorkspace(
  data: WorkspaceJoinSchema,
): Promise<ActionResult<string>> {
  const { joinCode } = data;
  const session = await getServerSession();

  if (!session) return { status: 'error', error: 'Unauthorized' };

  const currentUserId = session.user.id;

  const validated = workspaceJoinSchema.safeParse(data);

  if (!validated.success) {
    return { status: 'error', error: 'Invalid Join Code' };
  }

  try {
    const result = await validateWorkspaceJoin(currentUserId, joinCode);

    if (!result.ok || !result.workspace) {
      return { status: 'error', error: 'You cant join this workspace' };
    }

    await prisma.membership.create({
      data: {
        userId: currentUserId,
        workspaceId: result.workspace?.id,
      },
    });

    return { status: 'success', data: result.workspace.id };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}
