import React from 'react';
import { columns } from '../../../../components/TicketsComponents/columns';
import TicketsContainer from '@/components/TicketsComponents/TicketsContainer';
import { getAllTicketsByWorkspaceId } from '@/app/actions/ticketsActions';
import { notFound } from 'next/navigation';

export default async function TicketsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ workspaceId }, { page }] = await Promise.all([params, searchParams]);
  const pageNumber = Number(page) || 1;
  const result = await getAllTicketsByWorkspaceId(workspaceId, pageNumber);

  if (result.status !== 'success') {
    notFound();
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
