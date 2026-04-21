'use server';
import { Button } from '@heroui/button';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { getServerSession } from '@/app/actions/authActions';
import AppLogo from '../AppLogo';
import NextLink from '../NextLink';
import NavLink from './NavLink';
import UserMenu from './UserMenu';

export default async function TopNav() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <Navbar
      maxWidth="full"
      className="bg-linear-to-r from-teal-600 to-teal-900 h-16"
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
      <NavbarContent justify="start" className="flex">
        <NavbarItem as={NextLink} href="/">
          <AppLogo width={120} />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="center" className="flex">
        {user && <NavLink label="Workspaces" href={`/workspace`} />}
      </NavbarContent>
      <NavbarContent justify="end" className="flex">
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
      </NavbarContent>
    </Navbar>
  );
}
