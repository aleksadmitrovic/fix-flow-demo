'use client';
import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Input } from '@heroui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import AppLogo from '@/components/AppLogo';
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
} from '@/components/EyeSlashFilledIcon';
import { signInUser } from '@/app/actions/authActions';
import { LoginSchema, loginSchema } from '@/lib/schemas/loginFormSchema';

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function onSubmit(formData: LoginSchema) {
    const result = await signInUser(formData);
    if (result.status === 'success') {
      router.push(`/workspace`);
      router.refresh();
      toast.success('Login success');
    } else {
      toast.error(result.error as string);
    }
  }

  return (
    <Card className=" p-4 w-3/5 md:w-2/5 lg:w-1/3">
      <CardHeader className="flex flex-col">
        <AppLogo width={150} />
        <div className="flex flex-col items-baseline justify-center w-full">
          <h1 className="text-lg md:text-2xl">Login</h1>
          <div>
            <span className="text-sm md:text-xl">Sign in to your account</span>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <form
          id="loginForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            {...register('email')}
            label="Email"
            variant="faded"
            color="primary"
            labelPlacement="inside"
            required
            autoComplete="email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message as string}
          />
          <Input
            {...register('password')}
            label="Password"
            variant="faded"
            color="primary"
            labelPlacement="inside"
            required
            autoComplete="current-password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message as string}
            type={isVisible ? 'text' : 'password'}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-solid outline-transparent"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </form>
      </CardBody>
      <CardFooter className="flex flex-col">
        <Button
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          fullWidth
          form="loginForm"
          type="submit"
          color="primary"
        >
          Sign In
        </Button>
        <div>
          <p>or</p>
        </div>
        <Button isDisabled={true} fullWidth variant="bordered">
          <FcGoogle size={20} /> Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
