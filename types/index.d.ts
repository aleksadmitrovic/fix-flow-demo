import { Role } from '@/lib/generated/prisma/enums';
import { ZodIssue } from 'zod';

type ActionResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string | ZodIssue[] };

type ModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

type UserCompanyRole = {
  id: string;
  companyId: string | null;
  role: Role | null;
};
