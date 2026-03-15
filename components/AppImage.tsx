import { Image } from '@heroui/image';
import React from 'react';

export default function AppImage() {
  return (
    <div className="hidden md:block">
      <Image alt="Worker Image" src="/images/handyman.png" width={300} />
    </div>
  );
}
