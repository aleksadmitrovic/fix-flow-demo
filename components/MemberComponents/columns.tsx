import { MembershipUserDto } from '@/types';

export const columns = [
  {
    key: 'role',
    label: 'Status',
  },
  {
    accessorKey: 'userEmail',
    header: 'Email',
  },
  {
    accessorKey: 'userName',
    header: 'Name',
  },
];
