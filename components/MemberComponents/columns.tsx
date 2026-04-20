import { MembershipUserDto } from '@/types';

export type ColumnKey = keyof MembershipUserDto | 'actions';

export type ColumnType = {
  key: ColumnKey;
  label: string;
};

export const columns: ColumnType[] = [
  {
    key: 'userName',
    label: 'Name',
  },
  {
    key: 'userEmail',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];
