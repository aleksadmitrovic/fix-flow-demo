import { getWorkspaceMembersForOwner } from '@/app/actions/membershipActions';
import MembersContainer from '@/components/MemberComponents/MembersContainer';
import MembersTable from '@/components/MemberComponents/MembersTable';

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { workspaceId } = await params;
  const currentPage = Number((await searchParams).page) || 1;

  const result = await getWorkspaceMembersForOwner(workspaceId, currentPage, 5);
  if (result.status !== 'success') {
    return null;
  }
  const { members, totalPages } = result.data;

  return (
    <MembersContainer
      members={members}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
