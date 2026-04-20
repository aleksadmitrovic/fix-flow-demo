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
  const { workspaceId } = await params;
  const page = Number((await searchParams).page) || 1;
  const result = await getAllTicketsByWorkspaceId(workspaceId, page);

  if (result.status !== 'success') {
    notFound();
  }

  const { tickets, totalPages, permissions } = result.data;

  return (
    <TicketsContainer
      columns={columns}
      tickets={tickets}
      totalPages={totalPages}
      currentPage={page}
      permissions={permissions}
      workspaceId={workspaceId}
    />
  );
}
