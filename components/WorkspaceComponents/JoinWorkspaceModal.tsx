'use client';
import React from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { ModalProps } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  workspaceJoinSchema,
  WorkspaceJoinSchema,
} from '@/lib/schemas/workspace/workspaceJoin';
import { joinWorkspace } from '@/app/actions/workspaceActions';

export default function JoinCompanyModal({ isOpen, onOpenChange }: ModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<WorkspaceJoinSchema>({
    resolver: zodResolver(workspaceJoinSchema),
    mode: 'onTouched',
  });

  async function onSubmit(formData: WorkspaceJoinSchema) {
    console.log(formData);
    const result = await joinWorkspace(formData);
    if (result.status === 'success') {
      toast.success('Successfully joined the Company');
      onOpenChange();
      router.refresh();
    } else {
      toast.error(result.error as string);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center bg-teal-800 text-gray-100">
              <p>Join Company</p>
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                id="joinCompany"
                className="flex flex-col gap-4"
              >
                <Input
                  {...register('joinCode')}
                  label="Join Code"
                  labelPlacement="inside"
                  variant="bordered"
                  isInvalid={!!errors.joinCode}
                  errorMessage={errors.joinCode?.message as string}
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
                form="joinCompany"
                type="submit"
                color="primary"
                variant="flat"
              >
                Join
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
