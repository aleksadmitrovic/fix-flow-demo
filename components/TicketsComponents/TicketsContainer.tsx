'use client';
import React, { useState, useTransition } from 'react';
import { useDisclosure } from '@heroui/react';
import { Button } from '@heroui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  closeTicket,
  deleteTicket,
  reopenTicket,
} from '@/app/actions/ticketsActions';
import { Permissions, TicketDto } from '@/types';
import TicketsTable from './TicketsTable';
import CreateTicketModal from './CreateTicketModal';
import AssignTicketModal from './AssignTicketModal';
import ConfirmationModal from '../ConfirmationModal';
import { ColumnType } from './columns';
import ReviewTicketModal from './ReviewTicketModal';
import TicketFilters from './TicketFilters';

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
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
  const {
    isOpen: isDetailModalOpen,
    onOpen: openDetailModal,
    onOpenChange: onDetailModalChange,
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

  function callReadTicket(ticket: TicketDto) {
    setSelectedTicket(ticket);
    openDetailModal();
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
      <ReviewTicketModal
        isOpen={isDetailModalOpen}
        onOpenChange={onDetailModalChange}
        ticket={selectedTicket}
      />
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onOpenChange={onTicketModalChange}
        selectedTicket={selectedTicket}
        mode={modalMode}
      />
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        body="Are you sure you want to delete this ticket"
        onConfirm={handleDeleteTicket}
        isLoading={isPending}
      />
      <AssignTicketModal
        isOpen={isAssignModalOpen}
        onOpenChange={onAssignModalChange}
        ticketId={ticketId}
      />
      <div className="flex justify-between items-center gap-4 p-4">
        <TicketFilters />
        <Button
          hidden={!permissions.canCreate}
          color="primary"
          onPress={callCreateTicket}
        >
          Create
        </Button>
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
        callReadTicket={callReadTicket}
      />
    </>
  );
}
