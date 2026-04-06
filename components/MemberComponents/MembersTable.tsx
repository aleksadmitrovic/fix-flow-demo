'use client';
import {
  removeMemberFromWorkspace,
  updateMemberRole,
} from '@/app/actions/membershipActions';
import { MemberAssignableRole, MembershipUserDto } from '@/types';
import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import { useDisclosure } from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';

interface MembersTableProps {
  members: MembershipUserDto[];
  totalPages: number;
  currentPage: number;
}

export default function MembersTable({
  members,
  totalPages,
  currentPage,
}: MembersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, startTransition] = useTransition();
  const [selectedMember, setSelectedMember] = useState<string>();

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

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
  }

  async function callRemoveMember(memberId: string) {
    onOpenChange();
    setSelectedMember(memberId);
  }

  function handleRemoveMember() {
    if (!selectedMember) {
      return;
    }
    startTransition(async () => {
      const result = await removeMemberFromWorkspace(selectedMember);
      if (result.status === 'success') {
        toast.success(`Successfully removed ${result.data}`);
        onOpenChange();
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    });
  }

  return (
    <div className="w-full overflow-x-auto p-10">
      <Table
        aria-label="Workspace members"
        className="min-w-75 "
        bottomContent={
          <div className="flex w-full justify-center mt-4">
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No members yet" isLoading={isPending}>
          {members.map((member) => (
            <TableRow key={member.userId} className="h-16">
              <TableCell>{member.userName}</TableCell>

              <TableCell className="text-sm text-gray-500">
                {member.userEmail}
              </TableCell>

              <TableCell>
                <Select
                  aria-label="Role"
                  size="sm"
                  variant="faded"
                  color="primary"
                  selectedKeys={[member.role]}
                  onChange={(e) =>
                    handleRoleChange(
                      member.id,
                      e.target.value as MemberAssignableRole,
                    )
                  }
                >
                  <SelectItem color="secondary" key="CLIENT">
                    Client
                  </SelectItem>
                  <SelectItem color="secondary" key="TECHNICIAN">
                    Technician
                  </SelectItem>
                  <SelectItem color="secondary" key="PENDING">
                    Pending
                  </SelectItem>
                </Select>
              </TableCell>

              <TableCell>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  radius="lg"
                  className="text-red-800"
                  onPress={() => callRemoveMember(member.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        body="Are you sure you want to remove member from workspace"
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
