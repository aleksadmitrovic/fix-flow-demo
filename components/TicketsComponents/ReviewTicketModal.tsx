import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { TicketDto } from '@/types';
import { Chip } from '@heroui/chip';
import { priorityColorMap, statusColorMap } from './ticketUtils';
import { Priority, TicketStatus } from '@/lib/generated/prisma/enums';

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  ticket?: TicketDto | null;
};

export default function ReviewTicketModal({
  isOpen,
  onOpenChange,
  ticket,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="">
          <div className="w-full flex justify-between items-center">
            <p>{ticket?.title}</p>
            <div className="flex justify-center items-center gap-4 mr-4">
              <Chip
                className="capitalize"
                color={
                  ticket?.status
                    ? statusColorMap[ticket?.status as TicketStatus]
                    : 'default'
                }
                size="sm"
                variant="flat"
              >
                {ticket?.status}
              </Chip>
              <Chip
                className="capitalize"
                color={
                  ticket?.priority
                    ? priorityColorMap[ticket?.priority as Priority]
                    : 'default'
                }
                size="sm"
                variant="flat"
              >
                {ticket?.priority}
              </Chip>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm pb-4">
            {ticket?.description || 'No description provided.'}
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
