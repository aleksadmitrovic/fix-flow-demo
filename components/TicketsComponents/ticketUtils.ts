import { Priority, TicketStatus } from '@/lib/generated/prisma/enums';
import { ChipProps } from '@heroui/chip';

type ChipColor = ChipProps['color'];

export const statusColorMap: Record<TicketStatus, ChipColor> = {
  [TicketStatus.OPEN]: 'warning',
  [TicketStatus.CLOSED]: 'success',
  [TicketStatus.IN_PROGRESS]: 'primary',
};
export const priorityColorMap: Record<Priority, ChipColor> = {
  [Priority.HIGH]: 'danger',
  [Priority.MEDIUM]: 'warning',
  [Priority.LOW]: 'success',
};
