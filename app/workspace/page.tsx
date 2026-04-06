import WorkspaceEntry from '@/components/WorkspaceComponents/WorkspaceEntry';
import WorkspaceList from '@/components/WorkspaceComponents/WorkspaceList';
import { getWorkspacesForCurrentUser } from '../actions/workspaceActions';

export default async function DashboardPage() {
  const results = await getWorkspacesForCurrentUser();

  const rightSide =
    results.status === 'success' ? (
      <WorkspaceList workspaces={results.data} />
    ) : (
      <div className="text-red-500">
        {typeof results.error === 'string' ? (
          results.error
        ) : (
          <ul>
            {results.error.map((issue, index) => (
              <li key={index}>{issue.message}</li>
            ))}
          </ul>
        )}
      </div>
    );

  return (
    <div className="h-screen flex flex-col md:flex-row md:h-full">
      <WorkspaceEntry />
      {rightSide}
    </div>
  );
}
