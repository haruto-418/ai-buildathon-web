"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { userSchema } from "@/lib/schemas";

import { usersColRef } from "./server-utils";

const updateUserSchema = z.object({
  user: userSchema.partial().extend({
    id: z.string(),
  }),
});
type UpdateUser = z.infer<typeof updateUserSchema>;
export const updateUser = async (args: UpdateUser) => {
  const { user } = updateUserSchema.parse(args);

  try {
    await usersColRef.doc(user.id).update(user);
    console.info(`User ${user.id} updated`);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user");
  }

  revalidateTag("users");

  return user;
};
