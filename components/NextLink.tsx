'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

const NextLink = ({
  href,
  children,
  className,
  ...props
}: {
  className?: string;
  href: string;
  children: ReactNode;
}) => (
  <Link href={href} className={className} {...props}>
    {children}
  </Link>
);

export default NextLink;
