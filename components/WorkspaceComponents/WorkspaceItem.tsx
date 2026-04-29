'use client';
import React, { useTransition } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Role } from '@/lib/generated/prisma/enums';
import NextLink from '../NextLink';
import { Button, useDisclosure } from '@heroui/react';
import { deleteWorkspace } from '@/app/actions/workspaceActions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../ConfirmationModal';

type Props = {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
};

export default function WorkspaceItem({ id, name, role, createdAt }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const href =
    role === 'ADMIN' ? `/workspace/${id}/members` : `/workspace/${id}/tickets`;

  function handleDeleteWorkspace() {
    startTransition(async () => {
      const result = await deleteWorkspace(id);
      if (result.status === 'success') {
        toast.success('Successfully deleted workspace');
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }

  function callDeleteWorkspace() {
    onOpen();
  }

  return (
    <>
      <Card className="p-4 hover:shadow-xl transition ">
        <CardHeader>
          <h4 className="font-semibold text-lg">{name}</h4>
        </CardHeader>
        <CardBody>
          <p>
            Role:
            <span className="ml-1 font-semibold text-teal-700">{role}</span>
          </p>
          <p>
            Created: <span className="ml-1">{createdAt}</span>
          </p>
          {role === 'PENDING' ? (
            <span className="mt-2 inline-block text-gray-400 cursor-not-allowed">
              Go to workspace
            </span>
          ) : (
            <NextLink
              href={href}
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Go to workspace
            </NextLink>
          )}
        </CardBody>
        <CardFooter>
          {role === 'ADMIN' ? (
            <Button
              onPress={callDeleteWorkspace}
              className="w-4"
              color="danger"
              size="sm"
            >
              Delete
            </Button>
          ) : null}
        </CardFooter>
      </Card>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isLoading={isPending}
        body="Are you sure you want to delete workspace"
        onConfirm={handleDeleteWorkspace}
      />
    </>
  );
}
