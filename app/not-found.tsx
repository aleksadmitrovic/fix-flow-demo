'use client';
import { Button } from '@heroui/button';
import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <h1 className="text-7xl font-extrabold text-red-600 dark:text-red-500 mb-4 animate-pulse">
        404
      </h1>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Oops! Page not found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn’t exist or has been moved. Try going
        back to the homepage.
      </p>
      <Button as={Link} href="/" variant="solid" color="primary">
        Go Home
      </Button>
    </div>
  );
}
