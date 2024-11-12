import { NextResponse } from 'next/server';

import { userSchema } from '@/lib/schemas';
import type { User } from '@/lib/types';
import { createUser } from '@/utils/interfaces/users/create';

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  const { data } = body;
  if (!data) {
    console.error('Invalid request body', body);
    return NextResponse.json({
      error: 'Invalid request body',
    });
  }

  const createdAtFromUnixTimestamp = new Date(data.created_at);
  const email = data.email_addresses[0].email_address;

  const _user: User = {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    imageUrl: data.image_url ?? null,
    email,
    createdAt: createdAtFromUnixTimestamp,
  };
  console.log(_user);

  const user = userSchema.parse(_user);

  try {
    await createUser({ user });
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      error: err,
    });
  }
}
