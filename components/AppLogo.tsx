'use client';
import { Image } from '@heroui/image';
import React from 'react';

export default function AppLogo({ width }: { width: number }) {
  return (
    <div className="w-22 sm:w-32">
      <Image alt="Worker Logo" src="/images/fix-flow-logo.png" width={width} />
    </div>
  );
}
