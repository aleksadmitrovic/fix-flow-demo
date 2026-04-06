import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  title?: string | null;
  body: string;
  onConfirm: () => void;
};

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  title,
  body,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{body}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="success" variant="flat" onPress={onConfirm}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
