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
import { useCallback, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';
import { ColumnKey, columns } from './columns';
import { ActionTooltip } from '../TicketsComponents/ActionTooltip';
import { FaRegTrashAlt } from 'react-icons/fa';

type MembersTableProps = {
  members: MembershipUserDto[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  handleRoleChange: (id: string, role: MemberAssignableRole) => void;
  callRemoveMember: (id: string) => void;
};

export default function MembersTable({
  members,
  totalPages,
  currentPage,
  callRemoveMember,
  handleRoleChange,
  isLoading,
}: MembersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [isPending, startTransition] = useTransition();
  // const [selectedMember, setSelectedMember] = useState<string>();

  // function handleRoleChange(memberId: string, role: MemberAssignableRole) {
  //   startTransition(async () => {
  //     const result = await updateMemberRole(memberId, role);
  //     if (result.status === 'success') {
  //       toast.success(`Successfully updated ${result.data} role`);
  //       router.refresh();
  //     } else {
  //       toast.error(result.error as string);
  //     }
  //   });
  // }

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
  }

  // async function callRemoveMember(memberId: string) {
  //   onOpen();
  //   setSelectedMember(memberId);
  // }

  // const handleRemoveMember = useCallback(
  //   (selectedMember: string) => {
  //     startTransition(async () => {
  //       const result = await removeMemberFromWorkspace(selectedMember);
  //       if (result.status === 'success') {
  //         toast.success(`Successfully removed ${result.data}`);
  //         onOpenChange();
  //         router.refresh();
  //       } else {
  //         toast.error(result.error as string);
  //       }
  //     });
  //   },
  //   [onOpenChange, router],
  // );

  const renderCell = useCallback(
    (member: MembershipUserDto, columnKey: ColumnKey) => {
      if (columnKey === 'actions') {
        return (
          <ActionTooltip
            content="Delete ticket"
            color="danger"
            icon={<FaRegTrashAlt size={20} />}
            onClick={() => callRemoveMember(member.id)}
          />
        );
      }

      const cellValue = member[columnKey];
      switch (columnKey) {
        case 'role':
          return (
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
          );
        default:
          return cellValue;
      }
    },
    [callRemoveMember, handleRoleChange],
  );

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
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No members yet" isLoading={isLoading}>
          {members.map((row) => (
            <TableRow key={row.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(row, columnKey as keyof MembershipUserDto)}
                </TableCell>
              )}
            </TableRow>
          ))}
          {/* {members.map((member) => (
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
          ))} */}
        </TableBody>
      </Table>
      {/* <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        body="Are you sure you want to remove member from workspace"
        onConfirm={handleRemoveMember}
      /> */}
    </div>
  );
}
