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
    // サブコレクション以外のデータを Firestore に保存
    const { handoverDocuments, ...handoverData } = handover;
    await handoverDocRef.set({
      ...handoverData,
      id: handoverDocRef.id,
    });

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

  revalidateTag("handovers");

  return handoverDocRef.id;
}
