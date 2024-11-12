'use server';

import { type User as ClerkUser } from '@clerk/nextjs/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { userSchema } from '@/lib/schemas';
import type { User } from '@/lib/types';

import { usersColRef } from './server-utils';

// ------------------ create user ------------------
const createUserSchema = z.object({
  user: userSchema,
});
type CreateUser = z.infer<typeof createUserSchema>;
export async function createUser(args: CreateUser) {
  const { user } = createUserSchema.parse(args);

  try {
    await usersColRef.doc(user.id).set(user);
    console.info('User created', user);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to create user');
  }

  revalidateTag('users');
}

// ------------------ create user in Firestore ------------------
type CreateUserInFirestore = { user: ClerkUser };
export async function createUserInFirestore({ user }: CreateUserInFirestore) {
  try {
    const _user: User = {
      id: user?.id as string,
      imageUrl: user?.imageUrl ?? null,
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      email: user?.emailAddresses[0].emailAddress as string,
      createdAt: new Date(),
    };

    const parsed = userSchema.parse(_user);
    await createUser({ user: parsed });

    console.info('Firestore seed completed.');
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to create user in Firestore: ${err}`);
  }

  revalidateTag('users');
}
