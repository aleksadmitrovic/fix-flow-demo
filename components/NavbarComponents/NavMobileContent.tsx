import { NavbarContent, NavbarMenuToggle } from '@heroui/navbar';
import React from 'react';
import AppLogo from '../AppLogo';

export default function NavMobileContent() {
  return (
    <>
      <NavbarContent justify="start" className="sm:hidden">
        <NavbarMenuToggle className="sm:hidden" />
      </NavbarContent>
      <NavbarContent justify="end" className="sm:hidden">
        <AppLogo width={70} />
      </NavbarContent>
    </>
  );
}
