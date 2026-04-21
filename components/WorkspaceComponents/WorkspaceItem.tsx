import React from 'react';
import { Card } from '@heroui/card';
import { Role } from '@/lib/generated/prisma/enums';
import NextLink from '../NextLink';

type Props = {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
};

export default function WorkspaceItem({ id, name, role, createdAt }: Props) {
  const href =
    role === 'ADMIN' ? `/workspace/${id}/members` : `/workspace/${id}/tickets`;

  return (
    <Card className="p-4 hover:shadow-lg transition ">
      <h4 className="font-semibold text-lg">{name}</h4>
      <p>
        Role:
        <span className="ml-1 font-semibold text-teal-700">{role}</span>
      </p>
      <p>
        Created: <span className="ml-1">{createdAt}</span>
      </p>
      {role === 'PENDING' ? (
        <span className="mt-2 inline-block text-gray-400 cursor-not-allowed">
          Go to workspace
        </span>
      ) : (
        <NextLink
          href={href}
          className="mt-2 inline-block text-blue-600 hover:underline"
        >
          Go to workspace
        </NextLink>
      )}
    </Card>
  );
}
