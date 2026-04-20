// export type ColumnType = {
//   key: string;
//   label: string;
// };

import { TicketDto } from '@/types';

export type ColumnKey = keyof TicketDto | 'actions';

export type ColumnType = {
  key: ColumnKey;
  label: string;
};

export const columns: ColumnType[] = [
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'priority',
    label: 'Priority',
  },
  {
    key: 'workspaceName',
    label: 'Workspace',
  },
  {
    key: 'createdBy',
    label: 'Created By',
  },
  {
    key: 'assignedTo',
    label: 'Assigned To',
  },
  {
    key: 'scheduleAt',
    label: 'Schedule At',
  },
  {
    key: 'completedAt',
    label: 'Completed At',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
  {
    key: 'updatedAt',
    label: 'updated At',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];
