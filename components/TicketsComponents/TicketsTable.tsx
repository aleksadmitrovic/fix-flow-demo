'use client';

import React, { useCallback } from 'react';
import { ColumnKey, ColumnType } from './columns';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { Chip, ChipProps } from '@heroui/chip';
import { Pagination } from '@heroui/pagination';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuPencilLine } from 'react-icons/lu';
import { LuWrench } from 'react-icons/lu';
import { Priority, TicketStatus } from '@/lib/generated/prisma/enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { Permissions, TicketDto } from '@/types';
import { ActionTooltip } from './ActionTooltip';
import { FaCheckCircle } from 'react-icons/fa';
import { LuRotateCcw } from 'react-icons/lu';

type TicketTableProps = {
  tickets: TicketDto[];
  columns: ColumnType[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  permissions: Permissions;
  callDeleteTicket: (ticket: TicketDto) => void;
  callEditTicket: (ticket: TicketDto) => void;
  callAssignTicket: (ticketId: string) => void;
  handleCloseTicket: (ticket: TicketDto) => void;
  handleReopenTicket: (ticket: TicketDto) => void;
};

type ChipColor = ChipProps['color'];

const statusColorMap: Record<TicketStatus, ChipColor> = {
  [TicketStatus.OPEN]: 'warning',
  [TicketStatus.CLOSED]: 'success',
  [TicketStatus.IN_PROGRESS]: 'primary',
};
const priorityColorMap: Record<Priority, ChipColor> = {
  [Priority.HIGH]: 'danger',
  [Priority.MEDIUM]: 'warning',
  [Priority.LOW]: 'success',
};

export default function TicketTable({
  tickets,
  columns,
  totalPages,
  currentPage,
  isLoading,
  permissions,
  callDeleteTicket,
  callEditTicket,
  callAssignTicket,
  handleCloseTicket,
  handleReopenTicket,
}: TicketTableProps) {
  const { canDelete, canAssign, canUpdate, canReopen } = permissions;
  const searchParams = useSearchParams();
  const router = useRouter();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
  }

  const renderCell = useCallback(
    (ticket: TicketDto, columnKey: ColumnKey) => {
      if (columnKey === 'actions') {
        return (
          <div className="relative flex items-center gap-4">
            {canUpdate && (
              <ActionTooltip
                content="Edit ticket"
                color="warning"
                icon={<LuPencilLine size={20} />}
                onClick={() => callEditTicket(ticket)}
              />
            )}
            {canDelete && (
              <ActionTooltip
                content="Delete ticket"
                color="danger"
                icon={<FaRegTrashAlt size={20} />}
                onClick={() => callDeleteTicket(ticket)}
              />
            )}
            {canReopen && (
              <ActionTooltip
                content="Reopen ticket"
                color="primary"
                icon={<LuRotateCcw size={20} />}
                onClick={() => handleReopenTicket(ticket)}
              />
            )}
            {canAssign && (
              <ActionTooltip
                content="Assign to ticket"
                color="secondary"
                icon={<LuWrench size={20} />}
                onClick={() => callAssignTicket(ticket.id)}
              />
            )}
            {canAssign && ticket.assignedTo && (
              <ActionTooltip
                content="Mark as done"
                color="success"
                icon={<FaCheckCircle size={20} />}
                onClick={() => handleCloseTicket(ticket)}
              />
            )}
          </div>
        );
      }

      const cellValue = ticket[columnKey];
      switch (columnKey) {
        case 'priority':
          return (
            <Chip
              className="capitalize"
              color={priorityColorMap[ticket.priority as Priority]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[ticket.status as TicketStatus]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    [
      callDeleteTicket,
      canUpdate,
      canDelete,
      canAssign,
      canReopen,
      callEditTicket,
      callAssignTicket,
      handleCloseTicket,
      handleReopenTicket,
    ],
  );

  return (
    <div className="overflow-x-auto p-4">
      <Table
        aria-label="Tickets Table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody
          emptyContent={'No tickets to display.'}
          isLoading={isLoading}
        >
          {tickets.map((row) => (
            <TableRow key={row.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(row, columnKey as keyof TicketDto)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
