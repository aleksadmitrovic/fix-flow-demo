import { UserCompanyRole } from '@/types';

export function getDashboardRedirect(user: UserCompanyRole): string | null {
  switch (user.role) {
    case 'CLIENT':
      return `/dashboard/${user.companyId}/tickets/${user.id}`;
    case 'TEHNICIAN':
      return `/dashboard/${user.companyId}/tickets`;
    default:
      return null;
  }
}
