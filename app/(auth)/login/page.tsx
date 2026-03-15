import React from 'react';
import LoginForm from './LoginForm';
import AppImage from '@/components/AppImage';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center gap-20 h-full">
      <AppImage />
      <LoginForm />
    </div>
  );
}
