'use client';
import { Image } from '@heroui/image';
import React from 'react';

export default function AppLogo({ width }: { width: number }) {
  return (
    <div>
      <Image alt="Worker Logo" src="/images/fix-flow-logo.png" width={width} />
    </div>
  );
}
