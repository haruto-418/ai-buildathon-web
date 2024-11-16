"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { handoverSchema } from "@/lib/schemas";

import { fetchUserByEmail } from "../users/fetch";
import { handoversRef } from "./server-utils";

// ----------------- update handover -----------------
const updateHandoverSchema = z.object({
  handover: handoverSchema.partial().extend({
    id: z.string(),
  }),
});
type UpdateHandover = z.infer<typeof updateHandoverSchema>;
export async function updateHandover(args: UpdateHandover) {
  const { handover } = updateHandoverSchema.parse(args);

  try {
    await handoversRef.doc(handover.id).update(handover);
    console.info(`Handover ${handover.id} updated`);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update handover");
  }

  revalidateTag("handovers");

  return handover;
}

// ----------------- update handover successor id by email -----------------
const updateHandoverSuccessorIdByEmailSchema = z.object({
  handoverId: z.string(),
  email: z.string(),
});
type UpdateHandoverSuccessorIdByEmail = z.infer<
  typeof updateHandoverSuccessorIdByEmailSchema
>;
export async function updateHandoverSuccessorIdByEmail(
  args: UpdateHandoverSuccessorIdByEmail,
) {
  const { handoverId, email } =
    updateHandoverSuccessorIdByEmailSchema.parse(args);

  const successor = await fetchUserByEmail({ email });

  try {
    await updateHandover({
      handover: {
        id: handoverId,
        successorId: successor.id,
      },
    });
    console.info(`Handover ${handoverId} updated`);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update handover successor id");
  }

  revalidateTag("handovers");

  return handoverId;
}
