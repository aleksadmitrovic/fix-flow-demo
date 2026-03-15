import AppImage from '@/components/AppImage';
import React from 'react';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center gap-20 h-full">
      <AppImage />
      <RegisterForm />
    </div>
  );
}
