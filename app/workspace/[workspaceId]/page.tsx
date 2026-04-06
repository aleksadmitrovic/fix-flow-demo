import { getWorkspaceMembersForOwner } from '@/app/actions/membershipActions';
import MembersTable from '@/components/MemberComponents/MembersTable';

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { workspaceId } = await params;
  const page = Number((await searchParams).page) || 1;

  const result = await getWorkspaceMembersForOwner(workspaceId, page, 5);
  if (result.status !== 'success') {
    return null;
  }
  const { members, totalPages } = result.data;

  return (
    <MembersTable
      members={members}
      totalPages={totalPages}
      currentPage={page}
    />
  );
}
