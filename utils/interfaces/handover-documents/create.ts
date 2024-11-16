"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { handoverDocumentSchema } from "@/lib/schemas";

import { handoversRef } from "../handovers/server-utils";

const createHandoverDocumentSchema = z.object({
  handoverId: z.string(),
  handoverDocument: handoverDocumentSchema,
});
type CreateHandoverDocument = z.infer<typeof createHandoverDocumentSchema>;
export async function createHandoverDocument(args: CreateHandoverDocument) {
  const { handoverId, handoverDocument } =
    createHandoverDocumentSchema.parse(args);

  let handoverDocumentId = "";
  try {
    const handoverDocRef = handoversRef.doc(handoverId);
    const handoverDocumentRef = handoverDocRef
      .collection("handoverDocuments")
      .doc();
    await handoverDocumentRef.set({
      ...handoverDocument,
      id: handoverDocumentRef.id,
    });
    handoverDocumentId = handoverDocumentRef.id;

    console.info(`Handover document ${handoverDocumentRef.id} created`);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create handover document");
  }

  revalidateTag("handoverDocuments");
  revalidateTag("handovers");

  if (!handoverDocumentId) {
    throw new Error("Failed to create handover document");
  }

  return handoverDocumentId;
}
