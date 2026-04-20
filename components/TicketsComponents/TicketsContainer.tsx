'use client';

import React, { useState, useTransition } from 'react';
import TicketsTable from './TicketsTable';
import { ColumnType } from './columns';
import { Permissions, TicketDto } from '@/types';
import ConfirmationModal from '../ConfirmationModal';
import { useDisclosure } from '@heroui/react';
import {
  closeTicket,
  deleteTicket,
  reopenTicket,
} from '@/app/actions/ticketsActions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import CreateTicketModal from './CreateTicketModal';
import AssignTicketModal from './AssignTicketModal';

type TicketTableProps = {
  tickets: TicketDto[];
  columns: ColumnType[];
  totalPages: number;
  currentPage: number;
  permissions: Permissions;
  workspaceId: string;
};

export default function TicketsContainer({
  tickets,
  columns,
  totalPages,
  currentPage,
  permissions,
  workspaceId,
}: TicketTableProps) {
  const [ticketId, setTicketId] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<TicketDto | null>(null);
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const {
    isOpen: isTicketModalOpen,
    onOpen: openTicketModal,
    onOpenChange: onTicketModalChange,
  } = useDisclosure();
  const {
    isOpen: isAssignModalOpen,
    onOpen: openAssignModal,
    onOpenChange: onAssignModalChange,
  } = useDisclosure();

  const router = useRouter();

  function callDeleteTicket(ticket: TicketDto) {
    setSelectedTicket(ticket);
    onOpen();
  }

  function handleDeleteTicket() {
    if (!selectedTicket) return;
    startTransition(async () => {
      const result = await deleteTicket(selectedTicket.id);
      if (result.status === 'success') {
        toast.success('Successfully deleted Ticket');
        onOpenChange();
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }

  function callEditTicket(ticket: TicketDto) {
    setModalMode('edit');
    setSelectedTicket(ticket);
    openTicketModal();
  }
  function callCreateTicket() {
    setModalMode('create');
    setSelectedTicket(null);
    openTicketModal();
  }

  function callAssignTicket(ticketId: string) {
    setTicketId(ticketId);
    openAssignModal();
  }

  function handleCloseTicket(ticket: TicketDto) {
    if (!ticket || !workspaceId) return;
    startTransition(async () => {
      const result = await closeTicket(ticket, workspaceId);
      if (result.status === 'success') {
        toast.success('Ticket successfully closed');
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }
  function handleReopenTicket(ticket: TicketDto) {
    if (!ticket || !workspaceId) return;
    startTransition(async () => {
      const result = await reopenTicket(ticket, workspaceId);
      if (result.status === 'success') {
        toast.success('Ticket successfully reopened');
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }

  return (
    <>
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onOpenChange={onTicketModalChange}
        selectedTicket={selectedTicket}
        mode={modalMode}
      />
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        body="Are you sure you want to remove member from workspace"
        onConfirm={handleDeleteTicket}
      />
      <AssignTicketModal
        isOpen={isAssignModalOpen}
        onOpenChange={onAssignModalChange}
        ticketId={ticketId}
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between gap-3 items-end">
          <Button
            hidden={!permissions.canCreate}
            color="primary"
            onPress={callCreateTicket}
          >
            Create
          </Button>
        </div>
      </div>
      <TicketsTable
        tickets={tickets}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        callDeleteTicket={callDeleteTicket}
        isLoading={isPending}
        permissions={permissions}
        callEditTicket={callEditTicket}
        callAssignTicket={callAssignTicket}
        handleCloseTicket={handleCloseTicket}
        handleReopenTicket={handleReopenTicket}
      />
    </>
  );
}
