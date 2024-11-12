import { z } from 'zod';
import { unstable_cache } from 'next/cache';

import type { User } from '@/lib/types';
import { firestoreTimestampToDate } from '../firestore-timestamp-to-date';
import { userSchema } from '@/lib/schemas';
import { usersColRef } from './server-utils';

function parseFirestoreUserIntoUser({
  docId,
  data,
}: {
  docId: string;
  data: FirebaseFirestore.DocumentData;
}): User {
  const user: User = {
    id: docId,
    ...(data as Omit<User, 'id'>),
    createdAt: firestoreTimestampToDate(data.createdAt),
  };

  return userSchema.parse(user);
}

// ----------------- fetch user -----------------
const fetchUserSchema = z.object({
  userId: z.string(),
});
type FetchUser = z.infer<typeof fetchUserSchema>;
export const fetchUser = unstable_cache(
  async (args: FetchUser): Promise<User> => {
    const { userId } = fetchUserSchema.parse(args);

    const userDoc = await usersColRef.doc(userId).get();
    if (!userDoc.exists) {
      throw new Error(`User not found: ${userId}`);
    }

    return parseFirestoreUserIntoUser({
      docId: userDoc.id,
      data: userDoc.data() as FirebaseFirestore.DocumentData,
    });
  },
  ['users'],
  {
    revalidate: false,
    tags: ['users'],
  }
);
