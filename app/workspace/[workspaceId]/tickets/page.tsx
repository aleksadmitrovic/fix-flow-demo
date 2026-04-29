import React from 'react';
import { columns } from '../../../../components/TicketsComponents/columns';
import TicketsContainer from '@/components/TicketsComponents/TicketsContainer';
import { getAllTicketsByWorkspaceId } from '@/app/actions/ticketsActions';

export default async function TicketsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { workspaceId } = await params;
  const pageNumber = Number((await searchParams).page) || 1;
  const result = await getAllTicketsByWorkspaceId(workspaceId, pageNumber);

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
