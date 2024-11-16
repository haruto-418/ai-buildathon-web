"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { handoverSchema } from "@/lib/schemas";
import { handoversRef } from "./server-utils";

const createHandoverSchema = z.object({
  handover: handoverSchema,
});
type CreateHandover = z.infer<typeof createHandoverSchema>;
export async function createHandover(args: CreateHandover) {
  const { handover } = createHandoverSchema.parse(args);

  const handoverDocRef = handoversRef.doc();
  try {
    await handoverDocRef.set({
      ...handover,
      id: handoverDocRef.id,
    });
    console.info("Handover created successfully");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create handover");
  }

  revalidateTag("handovers");

  return handoverDocRef.id;
}
