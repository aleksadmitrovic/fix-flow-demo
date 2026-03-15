import { NavbarMenu, NavbarMenuItem } from '@heroui/navbar';
import Link from 'next/link';
import React from 'react';

export default function NavMobileMenu() {
  return (
    <NavbarMenu>
      <NavbarMenuItem>
        <Link href="/">Home</Link>
      </NavbarMenuItem>

      <NavbarMenuItem>
        <Link href="/tickets">Tickets</Link>
      </NavbarMenuItem>

      <NavbarMenuItem>
        <Link href="/settings">Settings</Link>
      </NavbarMenuItem>

      <NavbarMenuItem>
        <Link href="/login">Login</Link>
      </NavbarMenuItem>

      <NavbarMenuItem>
        <Link href="/register">Register</Link>
      </NavbarMenuItem>
    </NavbarMenu>
  );
}
