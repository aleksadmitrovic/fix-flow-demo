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

const MEMBER_ROLES = ['CLIENT', 'TECHNICIAN', 'PENDING'] as const;

type MemberAssignableRole = (typeof MEMBER_ROLES)[number];
