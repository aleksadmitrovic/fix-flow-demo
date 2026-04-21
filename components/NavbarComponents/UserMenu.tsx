'use client';
import React from 'react';
import { User } from 'better-auth';
import { Avatar } from '@heroui/avatar';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/dropdown';
import { signOutUser } from '@/app/actions/authActions';

export default function UserMenu({ user }: { user: User }) {
  return (
    <Dropdown placement="bottom">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={'user avatar'}
          size="sm"
          src={'/images/user.png'}
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownSection showDivider>
          <DropdownItem
            key="signAs"
            textValue="Sign as"
            as="span"
            isReadOnly
            className="h-14 flex flex-row"
          >
            Singed in as {user.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem
          key="logOut"
          textValue="Logout"
          color="danger"
          onPress={async () => signOutUser()}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
