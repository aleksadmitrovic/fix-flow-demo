'use client';
import React, { ReactNode } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Button } from '@heroui/button';

type FormModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
};

export default function FormModal({
  isOpen,
  onOpenChange,
  title,
  children,
  onSubmit,
  isSubmitting,
  submitText,
}: FormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      aria-label="Create Ticket Modal"
      classNames={{
        wrapper: 'items-end items-center sm:justify-center',
        base: 'mx-2 sm:mx-4',
        closeButton: 'text-slate-100 hover:text-teal-700',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-center bg-teal-700 text-gray-100">
          {title}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button onPress={onOpenChange} variant="light">
            Cancel
          </Button>
          <Button onPress={onSubmit} isLoading={isSubmitting}>
            {submitText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
