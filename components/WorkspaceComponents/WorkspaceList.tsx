'use client';
import { Role } from '@/lib/generated/prisma/enums';
import { MembershipWorkspaceDto } from '@/types';
import WorkspaceItem from './WorkspaceItem';

type WorkspaceItem = {
  id: string;
  name: string;
  role: Role;
};

interface WorkspaceListProps {
  workspaces: MembershipWorkspaceDto[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="md:w-1/2 p-6 bg-linear-to-b from-slate-100 to-slate-200 overflow-y-auto ">
      <h2 className="text-2xl font-bold mb-4">Your Workspaces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 overflow-y-auto">
        {!workspaces || workspaces.length === 0 ? (
          <div className="text-xl">There are no workpsaces</div>
        ) : (
          workspaces.map((workspace) => (
            <WorkspaceItem
              key={workspace.workspaceId}
              id={workspace.workspaceId}
              name={workspace.workspaceName}
              role={workspace.role}
              createdAt={workspace.workspaceCreatedAt}
            />
          ))
        )}
      </div>
    </div>
  );
}
