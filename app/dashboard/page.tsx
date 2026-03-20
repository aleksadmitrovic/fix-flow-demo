import React from 'react';
import EmptyDashboard from './EmptyDashboard';
import { getOwnedCompanyOfCurrentUser } from '../actions/companyActions';
import { redirect } from 'next/navigation';
import { getCurrentUserCompanyRole } from '../actions/authActions';
import { getDashboardRedirect } from '@/lib/services/dashboard';

export default async function DashboardPage() {
  const [userRoleResult, ownedCompanyResult] = await Promise.all([
    getCurrentUserCompanyRole(),
    getOwnedCompanyOfCurrentUser(),
  ]);

  if (ownedCompanyResult.status === 'success') {
    return redirect(`dashboard/${ownedCompanyResult.data.id}`);
  }

  if (userRoleResult.status === 'success') {
    const redirectUrl = getDashboardRedirect(userRoleResult.data);
    if (redirectUrl) return redirect(redirectUrl);
  }

  return <EmptyDashboard />;
}
