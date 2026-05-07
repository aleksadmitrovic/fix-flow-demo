'use client';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { getPriorities, getTicketStatus } from '@/lib/util';
import React, { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function TicketFilters() {
  const priorities = useMemo(() => getPriorities(), []);
  const ticektStatuses = useMemo(() => getTicketStatus(), []);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function updateSearchParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center min-w-1/2 gap-4">
      <Select
        variant="bordered"
        color="primary"
        items={ticektStatuses}
        size="sm"
        label="Filter by status"
        isClearable={true}
        onChange={(e) => {
          updateSearchParam('status', e.target.value);
        }}
      >
        {(status) => <SelectItem key={status.value}>{status.label}</SelectItem>}
      </Select>
      <Select
        variant="bordered"
        color="primary"
        items={priorities}
        size="sm"
        label="Filter by priority"
        isClearable={true}
        onChange={(e) => {
          updateSearchParam('priority', e.target.value);
        }}
      >
        {(priority) => (
          <SelectItem key={priority.value} textValue="">
            {priority.label}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
