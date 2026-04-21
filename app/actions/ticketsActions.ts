'use server';
import prisma from '@/lib/prisma';
import { Ticket } from '@/lib/generated/prisma/client';
import { mapTicketToTicketDto } from '@/lib/mappings';
import {
  createTicketSchema,
  CreateTicketSchema,
} from '@/lib/schemas/ticket/createTicketSchema';
import {
  updateTicketSchema,
  UpdateTicketSchema,
} from '@/lib/schemas/ticket/updateTicketSchema';
import {
  assignTicketSchema,
  AssignTicketSchema,
} from '@/lib/schemas/ticket/assignTicketSchema';
import { ActionResult, Permissions, TicketDto } from '@/types';
import { getServerSession } from './authActions';
import { getCurrentMemberOnWorkspace } from './membershipActions';
import { canCloseTicket, canOpenTicket } from '../services/ticketService';

export async function getTicketById(id: string): Promise<ActionResult<Ticket>> {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket) {
      return { status: 'error', error: 'Ticket not found' };
    }

    return { status: 'success', data: ticket };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getAllTicketsByWorkspaceId(
  workspaceId: string,
  page: number = 1,
  limit: number = 12,
): Promise<
  ActionResult<{
    tickets: TicketDto[];
    totalPages: number;
    permissions: Permissions;
  }>
> {
  try {
    const skip = (page - 1) * limit;

    const member = await getCurrentMemberOnWorkspace(workspaceId);

    if (member.status !== 'success') {
      return { status: 'error', error: 'Unauthorized' };
    }

    const { role } = member.data;

    const where = {
      workspaceId,
      ...(role === 'CLIENT' && {
        createdBy: {
          id: member.data.id,
        },
      }),
    };

    const [result, total] = await prisma.$transaction([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          status: true,
          createdBy: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedTo: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          scheduleAt: true,
          completedAt: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const tickets = result.map(mapTicketToTicketDto);

    return {
      status: 'success',
      data: {
        tickets,
        totalPages,
        permissions: {
          canCreate: member.data.role === 'CLIENT',
          canRead: member.data.role === 'CLIENT',
          canUpdate: member.data.role === 'CLIENT',
          canDelete: member.data.role === 'CLIENT',
          canReopen: member.data.role === 'CLIENT',
          canAssign: member.data.role === 'TECHNICIAN',
        },
      },
    };
  } catch (error) {
    console.error('getAllTicketsByWorkspaceId error:', error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function createTicket(
  formData: CreateTicketSchema,
): Promise<ActionResult<Ticket>> {
  const validated = createTicketSchema.safeParse(formData);
  if (!validated.success) {
    return { status: 'error', error: 'Invalid ticket data' };
  }

  const { priority, title, workspaceId, description } = validated.data;

  const session = await getServerSession();
  if (!session) {
    return { status: 'error', error: 'Unauthorized' };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, workspaceId: formData.workspaceId },
  });
  if (!membership) {
    return { status: 'error', error: 'You are not a member of this workspace' };
  }

  if (membership.role !== 'CLIENT') {
    return { status: 'error', error: 'Only Client can create tickets' };
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description: description || '',
        priority,
        status: 'OPEN',
        workspaceId: workspaceId,
        createdById: membership.id,
      },
    });

    if (!ticket) {
      return { status: 'error', error: 'Failed to create a ticket' };
    }

    return { status: 'success', data: ticket };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function updateTicket(
  updatedTicket: UpdateTicketSchema,
): Promise<ActionResult<Ticket>> {
  const validated = updateTicketSchema.safeParse(updatedTicket);
  if (!validated.success) {
    return { status: 'error', error: 'Invalid ticket data' };
  }

  const { priority, title, workspaceId, description } = validated.data;

  const session = await getServerSession();
  if (!session) {
    return { status: 'error', error: 'Unauthorized' };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, workspaceId: updatedTicket.workspaceId },
  });
  if (!membership) {
    return { status: 'error', error: 'You are not a member of this workspace' };
  }

  if (membership.role !== 'CLIENT') {
    return { status: 'error', error: 'Only Client can create tickets' };
  }

  try {
    const ticket = await prisma.ticket.update({
      where: {
        id: validated.data.id,
      },
      data: {
        title,
        description: description || '',
        priority,
        status: 'OPEN',
        workspaceId: workspaceId,
        createdById: membership.id,
      },
    });

    if (!ticket) {
      return { status: 'error', error: 'Failed to update a ticket' };
    }

    return { status: 'success', data: ticket };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function deleteTicket(id: string): Promise<ActionResult<Ticket>> {
  const session = await getServerSession();

  if (!session) {
    return { status: 'error', error: 'Unauthorized' };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: id },
      select: { workspaceId: true, createdById: true },
    });

    if (!ticket) {
      return { status: 'error', error: 'Ticket not found' };
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id, workspaceId: ticket.workspaceId },
    });

    if (!membership) {
      return {
        status: 'error',
        error: 'You are not a member of this workspace',
      };
    }

    if (membership.role !== 'CLIENT') {
      return {
        status: 'error',
        error: 'Only clients can delete their own tickets',
      };
    }

    if (ticket.createdById !== membership.id) {
      return { status: 'error', error: 'You can only delete your own tickets' };
    }

    const deletedTicket = await prisma.ticket.delete({
      where: {
        id,
      },
    });

    return { status: 'success', data: deletedTicket };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function assignToTicket(
  data: AssignTicketSchema,
  ticketId: string,
): Promise<ActionResult<Ticket>> {
  const validated = assignTicketSchema.safeParse(data);
  if (!validated.success) {
    return { status: 'error', error: 'Invalid ticket data' };
  }

  try {
    const session = await getServerSession();
    if (!session) {
      return { status: 'error', error: 'Unauthorized' };
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: validated.data.workspaceId,
      },
    });
    if (!membership) {
      return {
        status: 'error',
        error: 'You are not a member of this workspace',
      };
    }

    if (membership.role !== 'TECHNICIAN') {
      return {
        status: 'error',
        error: 'Only Technician can assign to tickets',
      };
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        assignedToId: membership.id,
        status: 'IN_PROGRESS',
        scheduleAt: new Date(validated.data.scheduleAt),
      },
    });

    if (!ticket) {
      return { status: 'error', error: 'Failed to assign to ticket' };
    }

    return { status: 'success', data: ticket };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function closeTicket(
  ticket: TicketDto,
  workspaceId: string,
): Promise<ActionResult<Ticket>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return { status: 'error', error: 'Unauthorized' };
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: workspaceId,
      },
    });
    if (!membership) {
      return {
        status: 'error',
        error: 'You are not a member of this workspace',
      };
    }

    if (!canCloseTicket(membership.role, ticket.assignedTo)) {
      return { status: 'error', error: 'Not allowed to close ticket' };
    }

    const doneTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'CLOSED',
        completedAt: new Date(),
      },
    });

    return {
      status: 'success',
      data: doneTicket,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      error: 'Something went wrong',
    };
  }
}

export async function reopenTicket(
  ticket: TicketDto,
  workspaceId: string,
): Promise<ActionResult<Ticket>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return { status: 'error', error: 'Unauthorized' };
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: workspaceId,
      },
    });
    if (!membership) {
      return {
        status: 'error',
        error: 'You are not a member of this workspace',
      };
    }

    if (!canOpenTicket(membership.role, ticket.status)) {
      return { status: 'error', error: 'Not allowed to reopen the ticket' };
    }

    const reopenedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'OPEN',
        completedAt: null,
        scheduleAt: null,
        assignedToId: null,
      },
    });

    return { status: 'success', data: reopenedTicket };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      error: 'Something went wrong',
    };
  }
}
