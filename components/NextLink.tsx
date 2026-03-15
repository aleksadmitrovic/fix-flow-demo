'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

const NextLink = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link href={href} {...props}>
    {children}
  </Link>
);

export default NextLink;
