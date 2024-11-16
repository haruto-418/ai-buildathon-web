"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { outputSchema } from "@/lib/schemas";

import { outputsRef } from "./server-utils";

// ----------------- create output -----------------
const createOutputSchema = z.object({
  output: outputSchema,
});
type CreateOutput = z.infer<typeof createOutputSchema>;
export const createOutput = async (args: CreateOutput) => {
  const { output } = createOutputSchema.parse(args);

  const outputDocRef = await outputsRef.doc();
  try {
    await outputDocRef.set({
      ...output,
      id: outputDocRef.id,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error(`Failed to create output: ${err}`);
    throw new Error(`Failed to create output: ${err}`);
  }

  revalidateTag("outputs");

  return outputDocRef.id;
};
