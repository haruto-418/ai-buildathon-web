"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { handoverSchema } from "@/lib/schemas";

import { handoversRef } from "./server-utils";

const createHandoverSchema = z.object({
  handover: handoverSchema,
  revalidate: z.boolean().optional().nullable().default(true),
});
type CreateHandover = z.infer<typeof createHandoverSchema>;

export async function createHandover(args: CreateHandover) {
  const { handover, revalidate } = createHandoverSchema.parse(args);

  let handoverId = handover.id;
  let creatingHandover = handover;
  if (handoverId === "") {
    const handoverDocRef = handoversRef.doc();
    handoverId = handoverDocRef.id;
    creatingHandover = {
      ...handover,
      id: handoverId,
    };
  } else {
    handoverId = handover.id;
  }

  try {
    // サブコレクション以外のデータを Firestore に保存
    const { handoverDocuments, ...handoverData } = creatingHandover;
    const handoverDocRef = handoversRef.doc(handoverId);
    await handoverDocRef.set({ ...handoverData });

    // サブコレクションのデータを Firestore に保存
    if (handoverDocuments && handoverDocuments.length > 0) {
      const documentsCollectionRef =
        handoverDocRef.collection("handoverDocuments");
      const documentPromises = handoverDocuments.map((doc) =>
        documentsCollectionRef.doc(doc.id).set(doc),
      );
      await Promise.all(documentPromises);
    }

    console.info("Handover and handoverDocuments created successfully");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create handover");
  }

  if (revalidate) {
    revalidateTag("handovers");
  }

  return handoverId;
}
