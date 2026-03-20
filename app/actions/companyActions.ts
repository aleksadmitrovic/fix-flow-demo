'use server';
import {
  createCompanySchema,
  CreateCompanySchema,
} from '@/lib/schemas/companyFormSchema';
import { getServerSession } from './authActions';
import prisma from '@/lib/prisma';
import { Company } from '@/lib/generated/prisma/client';
import { ActionResult } from '@/types';
import { generateJoinCode } from '@/lib/util';
import {
  companyJoinSchema,
  CompanyJoinSchema,
} from '@/lib/schemas/companyJoinFormSchema';

async function createUniqueJoinCode(): Promise<string> {
  let code = '';
  let exists = true;
  while (exists) {
    code = generateJoinCode(10);
    const company = await prisma.company.findUnique({
      where: { joinCode: code },
    });
    exists = company !== null;
  }

  return code;
}

export default async function createCompany(
  formData: CreateCompanySchema,
): Promise<ActionResult<Company>> {
  const session = await getServerSession();
  const currentUserId = session?.user.id;
  if (!currentUserId) {
    return { status: 'error', error: 'Unauthorized' };
  }

  const validated = createCompanySchema.safeParse(formData);
  if (!validated.success) {
    return { status: 'error', error: 'Invalid input' };
  }

  const validatedData = validated.data;

  if (!currentUserId) return { status: 'error', error: 'User is not found' };
  try {
    const existingCompany = await prisma.company.findUnique({
      where: {
        ownerId: currentUserId,
      },
    });

    if (existingCompany) {
      return { status: 'error', error: 'User already has a company' };
    }

    const joinCode = await createUniqueJoinCode();

    const [newCompany] = await prisma.$transaction([
      prisma.company.create({
        data: {
          name: validatedData.name,
          joinCode,
          owner: {
            connect: { id: currentUserId },
          },
        },
      }),
      prisma.user.update({
        where: { id: currentUserId },
        data: { role: 'ADMIN' },
      }),
    ]);

    return { status: 'success', data: newCompany };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function joinUserToCompany(
  formData: CompanyJoinSchema,
): Promise<ActionResult<Company>> {
  const session = await getServerSession();
  const currentUserId = session?.user.id;
  if (!currentUserId) {
    return { status: 'error', error: 'Unauthorized' };
  }

  const validate = companyJoinSchema.safeParse(formData);

  if (!validate.success) {
    return { status: 'error', error: 'Invalid input' };
  }
  const validatedData = validate.data;

  try {
    const joinedCompany = await getCompanyByJoinCode(validatedData.joinCode);

    if (joinedCompany.status === 'error') {
      return { status: joinedCompany.status, error: joinedCompany.error };
    }

    await prisma.user.update({
      where: { id: currentUserId },
      data: { role: validatedData.role, companyId: joinedCompany.data.id },
    });

    return { status: 'success', data: joinedCompany.data };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getOwnedCompanyOfCurrentUser(): Promise<
  ActionResult<Company>
> {
  const session = await getServerSession();
  if (!session) {
    return { status: 'error', error: 'Unauthorized' };
  }

  const userId = session.user.id;
  try {
    const data = await prisma.company.findUnique({
      where: {
        ownerId: userId,
      },
    });

    if (!data) {
      return { status: 'error', error: 'Company Not Found' };
    }

    return { status: 'success', data: data };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getCompanyByJoinCode(
  joinCode: string,
): Promise<ActionResult<Company>> {
  try {
    const company = await prisma.company.findUnique({
      where: { joinCode },
    });

    if (!company) return { status: 'error', error: 'Company not found' };

    return { status: 'success', data: company };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}
