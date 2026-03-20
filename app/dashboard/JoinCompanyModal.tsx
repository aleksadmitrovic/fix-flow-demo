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
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompanyJoinSchema,
  companyJoinSchema,
} from '@/lib/schemas/companyJoinFormSchema';
import { Radio, RadioGroup } from '@heroui/radio';
import { joinUserToCompany } from '../actions/companyActions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function JoinCompanyModal({ isOpen, onOpenChange }: ModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CompanyJoinSchema>({
    resolver: zodResolver(companyJoinSchema),
    mode: 'onTouched',
  });

  async function onSubmit(formData: CompanyJoinSchema) {
    const result = await joinUserToCompany(formData);
    if (result.status === 'success') {
      toast.success('Successfully joined the Company');
      router.push(`/dashboard`);
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
                <Controller
                  name="role"
                  control={control}
                  defaultValue="CLIENT"
                  render={({ field }) => (
                    <RadioGroup
                      label="Join as"
                      orientation="horizontal"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Radio value="CLIENT">Client</Radio>
                      <Radio value="TEHNICIAN">Tehnician</Radio>
                    </RadioGroup>
                  )}
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
