'use client';

import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-linear-to-br from-white to-teal-50 flex">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
