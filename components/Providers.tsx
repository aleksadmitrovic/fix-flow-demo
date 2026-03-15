'use client';
import { HeroUIProvider } from '@heroui/react';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#1f1f1f',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '300px',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: '#4ade80', secondary: '#1f1f1f' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#f87171', secondary: '#1f1f1f' },
          },
          loading: {
            iconTheme: { primary: '#60a5fa', secondary: '#1f1f1f' },
          },
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
