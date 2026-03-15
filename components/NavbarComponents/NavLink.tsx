'use client';
import React from 'react';
import { NavbarItem } from '@heroui/navbar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Props = {
  href: string;
  label: string;
};

export default function NavLink({ href, label }: Props) {
  const pathName = usePathname();

  return (
    <NavbarItem isActive={pathName === href} as={Link} href={href}>
      <span>{label}</span>
    </NavbarItem>
  );
}
