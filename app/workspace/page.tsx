import WorkspaceEntry from '@/components/WorkspaceComponents/WorkspaceEntry';
import { WorkspaceListContainer } from '@/components/WorkspaceComponents/WorkspaceListContainer';

export default async function WorkspacePage() {
  return (
    <div className="h-screen flex flex-col md:flex-row md:h-full">
      <WorkspaceEntry />
      <WorkspaceListContainer />
    </div>
  );
}
