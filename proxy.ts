import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from './app/actions/authActions';

export async function proxy(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
