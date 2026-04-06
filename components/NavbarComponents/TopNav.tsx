'use server';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/button';
import AppLogo from '../AppLogo';
import UserMenu from './UserMenu';
import NavMobileContent from './NavMobileContent';
import NavMobileMenu from './NavMobileMenu';
import NextLink from '../NextLink';
import { getServerSession } from '@/app/actions/authActions';
import NavLink from './NavLink';

export default async function TopNav() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <Navbar
      maxWidth="full"
      className="bg-linear-to-r from-teal-600 to-teal-900 text-gray-100 h-16"
      isBordered
      classNames={{
        item: [
          'text-xl',
          'font-medium',
          'uppercase',
          'data-[active=true]:text-white',
          'data-[active=true]:border-b-2',
          'data-[active=true]:border-white',
        ],
      }}
    >
      <NavMobileContent />
      <NavbarContent justify="start" className="hidden sm:flex">
        <NavbarItem as={NextLink} href="/">
          <AppLogo width={120} />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden sm:flex">
        {user && <NavLink label="Workspaces" href={`/workspace`} />}
      </NavbarContent>
      <NavbarContent justify="end" className="hidden sm:flex">
        {!user ? (
          <>
            <Button as={NextLink} href="/login" variant="solid" color="default">
              Login
            </Button>
            <Button
              as={NextLink}
              href="/register"
              variant="solid"
              color="default"
            >
              Register
            </Button>
          </>
        ) : (
          <UserMenu user={user} />
        )}
        <NavMobileMenu />
      </NavbarContent>
    </Navbar>
  );
}
