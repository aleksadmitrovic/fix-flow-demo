import { getWorkspacesForCurrentUser } from '@/app/actions/workspaceActions';
import WorkspaceList from './WorkspaceList';

export async function WorkspaceListContainer() {
  const results = await getWorkspacesForCurrentUser();

  if (results.status !== 'success') {
    return (
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
  }

  return <WorkspaceList workspaces={results.data} />;
}
