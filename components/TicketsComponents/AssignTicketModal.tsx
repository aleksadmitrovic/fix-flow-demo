'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@heroui/button';
import { useParams, useRouter } from 'next/navigation';
import { ModalProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  assignTicketSchema,
  AssignTicketSchema,
} from '@/lib/schemas/ticket/assignTicketSchema';
import { assignToTicket } from '@/app/actions/ticketsActions';
import toast from 'react-hot-toast';

type TicketModalProps = ModalProps & {
  ticketId: string;
};

export default function AssignTicketModal({
  isOpen,
  onOpenChange,
  ticketId,
}: TicketModalProps) {
  const params = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AssignTicketSchema>({
    resolver: zodResolver(assignTicketSchema),
    mode: 'onTouched',
  });

  async function onSubmit(formData: AssignTicketSchema) {
    const result = await assignToTicket(formData, ticketId);
    if (result.status === 'success') {
      toast.success(`Successfully assinged to ticket`);
      router.refresh();
      reset();
      onOpenChange();
    } else {
      toast.error(result.error as string);
    }
  }

  return (
    <Modal
      backdrop="blur"
      aria-label="Create Ticket Modal"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: 'items-end items-center sm:justify-center',
        base: 'mx-2 sm:mx-4',
        closeButton: 'text-slate-100 hover:text-teal-700',
      }}
    >
      <ModalContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center bg-teal-700 text-gray-100">
              <p>Create Ticket</p>
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                id="assignTicket"
                className="flex flex-col gap-4 p-4 sm:p-6"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-default-500 pl-0.5">
                    Schedule at
                  </label>
                  <div className="border-2 border-primary rounded-xl px-3 py-2.5">
                    <input
                      {...register('scheduleAt')}
                      type="datetime-local"
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  {errors.scheduleAt && (
                    <p className="text-danger text-xs pl-0.5">
                      {errors.scheduleAt.message}
                    </p>
                  )}
                </div>
                <input
                  type="hidden"
                  {...register('workspaceId')}
                  value={params.workspaceId}
                />
              </form>
            </ModalBody>
            <ModalFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                isDisabled={isSubmitting}
                color="danger"
                variant="flat"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                isLoading={isSubmitting}
                form="assignTicket"
                type="submit"
                color="primary"
                variant="flat"
              >
                Assign
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
