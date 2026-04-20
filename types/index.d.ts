import { Prisma } from '@/lib/generated/prisma/client';
import { Role } from '@/lib/generated/prisma/enums';
import { ZodIssue } from 'zod';

type ActionResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string | ZodIssue[] };

type ModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

// MEMBERSHIP TYPES
type MemberWithWorkspacePayload = Prisma.MembershipGetPayload<{
  select: {
    id: true;
    role: true;
    workspace: {
      select: {
        id: true;
        name: true;
        createdAt: true;
      };
    };
  };
}>;

export type MembershipWorkspaceDto = {
  id: string;
  role: Role;
  workspaceId: string;
  workspaceName: string;
  workspaceCreatedAt: string;
};

type MemberWithUserPayload = Prisma.MembershipGetPayload<{
  select: {
    id: true;
    role: true;
    user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type MembershipUserDto = {
  id: string;
  role: Role;
  userId: string;
  userName: string;
  userEmail: string;
};

export type MembershipRole = {
  id: string;
  role: Role;
};

const MEMBER_ROLES = ['CLIENT', 'TECHNICIAN', 'PENDING'] as const;

type MemberAssignableRole = (typeof MEMBER_ROLES)[number];

// TICKET TYPES
type TicketWithMembershipPayload = Prisma.TicketGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    priority: true;
    status: true;
    createdBy: {
      select: {
        id: true;
        role: true;
        user: {
          select: {
            name: true;
          };
        };
      };
    };
    workspace: {
      select: {
        id: true;
        name: true;
      };
    };
    assignedTo: {
      select: {
        user: {
          select: {
            name: true;
          };
        };
      };
    };
    scheduleAt: true;
    completedAt: true;
    updatedAt: true;
    createdAt: true;
  };
}>;

export type TicketDto = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TicketStatus;
  memberRole: Role;
  createdBy: string;
  workspaceName: string;
  assignedTo?: string;
  updatedAt: string;
  createdAt: string;
  scheduleAt: string | null;
  completedAt: string | null;
};

type Permissions = {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canReopen: boolean;
};
