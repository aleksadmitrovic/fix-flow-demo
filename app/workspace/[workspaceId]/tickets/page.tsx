import React from 'react';
import { columns } from '../../../../components/TicketsComponents/columns';
import TicketsContainer from '@/components/TicketsComponents/TicketsContainer';
import { getAllTicketsByWorkspaceId } from '@/app/actions/ticketsActions';
import { Priority, TicketStatus } from '@/lib/generated/prisma/enums';

export default async function TicketsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{
    page?: string;
    status?: TicketStatus;
    priority?: Priority;
  }>;
}) {
  const { workspaceId } = await params;
  const { page, status, priority } = await searchParams;
  const pageNumber = Number(page) || 1;
  const result = await getAllTicketsByWorkspaceId(
    workspaceId,
    pageNumber,
    status,
    priority,
  );

  if (result.status !== 'success') {
    const error =
      typeof result.error === 'string' ? result.error : 'Something went wrong';

    return <div className="p-6 text-red-500">{error}</div>;
  }

  const { tickets, totalPages, permissions } = result.data;

  return (
    <TicketsContainer
      columns={columns}
      tickets={tickets}
      totalPages={totalPages}
      currentPage={pageNumber}
      permissions={permissions}
      workspaceId={workspaceId}
    />
  );
}
