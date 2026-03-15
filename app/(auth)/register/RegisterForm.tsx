'use client';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import React, { useState } from 'react';
import { Divider } from '@heroui/divider';
import { Input } from '@heroui/input';
import { FcGoogle } from 'react-icons/fc';
import AppLogo from '@/components/AppLogo';
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
} from '@/components/EyeSlashFilledIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RegisterSchema,
  registerSchema,
} from '@/lib/schemas/registerFormSchema';
import { registerUser } from '@/app/actions/authActions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function onSubmit(formData: RegisterSchema) {
    const result = await registerUser(formData);
    if (result.status === 'success') {
      router.push('/login');
      toast.success('Registration successful. You can now log in.');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Card className=" p-4 w-3/5 md:w-2/5 lg:w-1/3">
      <CardHeader className="flex flex-col">
        <AppLogo width={150} />
        <div className="flex flex-col items-baseline justify-center w-full">
          <h1 className="text-3xl">Register</h1>
          <div>
            <span>Sign up to your account</span>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <form
          id="registerForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          action=""
        >
          <Input
            {...register('name')}
            label="Name"
            variant="faded"
            color="primary"
            labelPlacement="inside"
            required
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
          />
          <Input
            {...register('email')}
            label="Email"
            variant="faded"
            color="primary"
            labelPlacement="inside"
            required
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
          <Input
            {...register('passwordConfirm')}
            label="Confirm Password"
            variant="faded"
            color="primary"
            labelPlacement="inside"
            required
            isInvalid={!!errors.passwordConfirm}
            errorMessage={errors.passwordConfirm?.message as string}
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
          form="registerForm"
          type="submit"
          color="primary"
        >
          Sign Up
        </Button>
        <div>
          <p>or</p>
        </div>
        <Button isDisabled={isSubmitting} fullWidth variant="bordered">
          <FcGoogle size={20} /> Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
