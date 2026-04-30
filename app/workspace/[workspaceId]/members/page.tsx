import {
  getWorkspaceMembersForOwner,
  isWorkspaceAdmin,
} from '@/app/actions/membershipActions';
import { getWorkspaceJoinCode } from '@/app/actions/workspaceActions';
import MembersContainer from '@/components/MemberComponents/MembersContainer';
import { redirect } from 'next/navigation';

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { workspaceId } = await params;
  const currentPage = Number((await searchParams).page) || 1;

  const isAdmin = await isWorkspaceAdmin(workspaceId);

  if (!isAdmin) redirect('/workspace');

  const [joinCodeResult, membersResult] = await Promise.all([
    getWorkspaceJoinCode(workspaceId),
    getWorkspaceMembersForOwner(workspaceId, currentPage, 5),
  ]);

  if (membersResult.status !== 'success') {
    const error =
      typeof membersResult.error === 'string'
        ? membersResult.error
        : 'Something went wrong';

    return <div className="p-6 text-red-500">{error}</div>;
  }
  const { members, totalPages } = membersResult.data;

  return (
    <MembersContainer
      members={members}
      totalPages={totalPages}
      currentPage={currentPage}
      joinCode={joinCodeResult?.joinCode}
    />
  );
}
