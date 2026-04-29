'use client';
import React, { useState, useTransition } from 'react';
import { useDisclosure } from '@heroui/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  removeMemberFromWorkspace,
  updateMemberRole,
} from '@/app/actions/membershipActions';
import { MemberAssignableRole, MembershipUserDto } from '@/types';
import MembersTable from './MembersTable';
import ConfirmationModal from '../ConfirmationModal';

type Props = {
  members: MembershipUserDto[];
  totalPages: number;
  currentPage: number;
  joinCode?: string | null;
};

export default function MembersContainer({
  currentPage,
  members,
  totalPages,
  joinCode,
}: Props) {
  const [memberId, setMemberId] = useState<string>();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, startTransition] = useTransition();

  async function callRemoveMember(id: string) {
    onOpen();
    setMemberId(id);
  }

  function handleRemoveMember() {
    if (!memberId) {
      return;
    }
    startTransition(async () => {
      const result = await removeMemberFromWorkspace(memberId);
      if (result.status === 'success') {
        toast.success(`Successfully removed ${result.data}`);
        onOpenChange();
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }

  function handleRoleChange(memberId: string, role: MemberAssignableRole) {
    startTransition(async () => {
      const result = await updateMemberRole(memberId, role);
      if (result.status === 'success') {
        toast.success(`Successfully updated ${result.data} role`);
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }

  return (
    <div>
      <MembersTable
        members={members}
        totalPages={totalPages}
        currentPage={currentPage}
        callRemoveMember={callRemoveMember}
        isLoading={isPending}
        handleRoleChange={handleRoleChange}
        joinCode={joinCode}
      />
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        body="Are you sure you want to remove member from workspace"
        onConfirm={handleRemoveMember}
        isLoading={isPending}
      />
    </div>
  );
}
