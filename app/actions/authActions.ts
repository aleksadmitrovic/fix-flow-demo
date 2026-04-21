'use server';
import { User } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { loginSchema, LoginSchema } from '@/lib/schemas/loginFormSchema';
import {
  registerSchema,
  RegisterSchema,
} from '@/lib/schemas/registerFormSchema';
import { ActionResult } from '@/types';

export async function signInUser(data: LoginSchema) {
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { status: 'error', error: validated.error.issues };
  }

  const { email, password } = validated.data;
  try {
    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { status: 'success', message: 'Login Succesfully', data: data.user };
  } catch (error) {
    if (isAPIError(error)) {
      return { status: 'error', error: error.message };
    }
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function signOutUser() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect('/login');
}

export async function registerUser(
  data: RegisterSchema,
): Promise<ActionResult<User>> {
  const validated = registerSchema.safeParse(data);

  if (!validated.success) {
    return { status: 'error', error: validated.error.issues };
  }

  if (validated.data.password !== validated.data.passwordConfirm) {
    return { status: 'error', error: 'Passwords must match' };
  }

  const { name, email, password } = validated.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return { status: 'error', error: 'User with that email already exists' };
    }

    const response = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name,
      },
    });

    const { user } = response;

    return { status: 'success', data: user };
  } catch (error) {
    console.log(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getServerSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}
