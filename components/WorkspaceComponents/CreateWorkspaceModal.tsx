'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';

import { createWorkspace } from '@/app/actions/workspaceActions';
import {
  workspaceCreateSchema,
  WorkspaceCreateSchema,
} from '@/lib/schemas/workspace/workspaceCreate';
import { ModalProps } from '@/types';

export default function CreateCompanyModal({
  isOpen,
  onOpenChange,
}: ModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WorkspaceCreateSchema>({
    resolver: zodResolver(workspaceCreateSchema),
    mode: 'onTouched',
  });
  const router = useRouter();

  async function onSubmit(data: WorkspaceCreateSchema) {
    const result = await createWorkspace(data);
    if (result.status === 'success') {
      toast.success('Company created successfully');
      router.push(`/workspace/${result.data.id}`);
    } else {
      toast.error('Failed to create company');
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center bg-teal-800 text-gray-100">
              <p>Create Your Workspace</p>
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                id="createCompany"
                className="flex flex-col gap-2"
              >
                <Input
                  {...register('name')}
                  label="Name"
                  labelPlacement="inside"
                  variant="bordered"
                />
              </form>
            </ModalBody>
            <ModalFooter>
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
                form="createCompany"
                type="submit"
                color="primary"
                variant="flat"
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
