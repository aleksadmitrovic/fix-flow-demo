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
import {
  CreateCompanySchema,
  createCompanySchema,
} from '@/lib/schemas/companyFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import createCompany from '../actions/companyActions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CreateCompanyModal({
  isOpen,
  onOpenChange,
}: ModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateCompanySchema>({
    resolver: zodResolver(createCompanySchema),
    mode: 'onTouched',
  });
  const router = useRouter();

  async function onSubmit(data: CreateCompanySchema) {
    const result = await createCompany(data);
    if (result.status === 'success') {
      toast.success('Company created successfully');
      router.push(`/dashboard/${result.data.id}`);
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
              <p>Create Your Company</p>
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
