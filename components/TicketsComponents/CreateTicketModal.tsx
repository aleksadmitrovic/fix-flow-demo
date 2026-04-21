'use client';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { getPriorities } from '@/lib/util';
import {
  createTicketSchema,
  CreateTicketSchema,
} from '@/lib/schemas/ticket/createTicketSchema';
import { createTicket, updateTicket } from '@/app/actions/ticketsActions';
import { ModalProps, TicketDto } from '@/types';

type TicketModalProps = ModalProps & {
  selectedTicket: TicketDto | null;
  mode: 'create' | 'edit';
};

export default function CreateTicketModal({
  isOpen,
  onOpenChange,
  selectedTicket,
  mode,
}: TicketModalProps) {
  const params = useParams();
  const router = useRouter();
  const priorities = useMemo(() => getPriorities(), []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      priority: undefined,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && selectedTicket) {
      reset({
        title: selectedTicket.title,
        description: selectedTicket.description ?? '',
        priority: selectedTicket.priority,
        workspaceId: params.workspaceId as string,
      });
    } else if (mode === 'create') {
      reset({
        title: '',
        description: '',
        priority: undefined,
        workspaceId: params.workspaceId as string,
      });
    }
  }, [selectedTicket, mode, reset, params.workspaceId]);

  async function onSubmit(data: CreateTicketSchema) {
    const action =
      mode === 'edit' && selectedTicket
        ? () => updateTicket({ ...data, id: selectedTicket.id })
        : () => createTicket(data);

    const result = await action();
    if (result.status === 'success') {
      toast.success(
        `Successfully ${mode === 'edit' ? 'updated' : 'created'} ticket`,
      );
      router.refresh();
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
                id="createTicket"
                className="flex flex-col gap-4 p-4 sm:p-6"
              >
                <Input
                  {...register('title')}
                  label="Title"
                  labelPlacement="inside"
                  variant="bordered"
                  color="primary"
                  isInvalid={!!errors.title}
                  errorMessage={errors.title?.message}
                  isRequired
                />
                <Textarea
                  {...register('description')}
                  label="Description"
                  labelPlacement="inside"
                  variant="bordered"
                  color="primary"
                />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="flex items-center gap-1 text-blue-500 whitespace-nowrap">
                    Priority: <span className="text-red-500">*</span>
                  </label>

                  <select
                    required
                    {...register('priority')}
                    className="w-full rounded-xl p-2 pr-10 border-2 border-gray-200 bg-white focus:border-blue-500 focus:outline-none"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
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
                form="createTicket"
                type="submit"
                color="primary"
                variant="flat"
              >
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
