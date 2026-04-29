'use client';

import { MemberAssignableRole, MembershipUserDto } from '@/types';
import { Pagination } from '@heroui/pagination';
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
import { useCallback, useMemo } from 'react';
import { ColumnKey, columns } from './columns';
import { ActionTooltip } from '../TicketsComponents/ActionTooltip';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuCopy } from 'react-icons/lu';
import { copyToClipboard, getMemberRoles } from '@/lib/util';
import { Code } from '@heroui/code';

type MembersTableProps = {
  members: MembershipUserDto[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  joinCode?: string | null;
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
  joinCode,
}: MembersTableProps) {
  const roles = useMemo(() => getMemberRoles(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
  }

  const renderCell = useCallback(
    (member: MembershipUserDto, columnKey: ColumnKey) => {
      if (columnKey === 'actions') {
        return (
          <ActionTooltip
            content="Remove member"
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
              {roles.map((role) => (
                <SelectItem color="secondary" key={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </Select>
          );
        default:
          return cellValue;
      }
    },
    [callRemoveMember, handleRoleChange, roles],
  );

  return (
    <div className="overflow-x-auto p-4">
      <Table
        aria-label="Workspace members"
        className="min-w-75 "
        topContent={
          <div className="flex items-center gap-2 bg-slate-100 w-fit p-2 rounded-2xl">
            <span>Join Code:</span>
            <Code size="md" className="text-teal-700 ">
              {joinCode}
            </Code>
            <button
              onClick={() => copyToClipboard(joinCode ? joinCode : '')}
              className="cursor-pointer hover:opacity-70 transition"
              title="Copy join code"
            >
              <LuCopy size={16} />
            </button>
          </div>
        }
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
        </TableBody>
      </Table>
    </div>
  );
}
