import { unstable_cache } from "next/cache";
import { z } from "zod";

import { handoverDocumentSchema } from "@/lib/schemas";
import type { HandoverDocument } from "@/lib/types";
import { firestoreTimestampToDate } from "../firestore-timestamp-to-date";
import { handoversRef } from "../handovers/server-utils";

function parseFirestoreHandoverDocumentIntoHandoverDocument({
  docId,
  data,
}: {
  docId: string;
  data: FirebaseFirestore.DocumentData;
}): HandoverDocument {
  const handoverDocument: HandoverDocument = {
    id: docId,
    ...(data as Omit<HandoverDocument, "id">),
    createdAt: firestoreTimestampToDate(data.createdAt),
  };

  return handoverDocumentSchema.parse(handoverDocument);
}

// ----------------- fetch handover document -----------------
const fetchHandoverDocumentSchema = z.object({
  handoverDocumentId: z.string(),
});
type FetchHandoverDocument = z.infer<typeof fetchHandoverDocumentSchema>;

// ----------------- fetch handover documents by handover id -----------------
const fetchHandoverDocumentsByHandoverIdSchema = z.object({
  handoverId: z.string(),
});
type FetchHandoverDocumentsByHandoverId = z.infer<
  typeof fetchHandoverDocumentsByHandoverIdSchema
>;
export const fetchHandoverDocumentsByHandoverId = unstable_cache(
  async (
    args: FetchHandoverDocumentsByHandoverId,
  ): Promise<HandoverDocument[]> => {
    const { handoverId } = fetchHandoverDocumentsByHandoverIdSchema.parse(args);

    const handoverDocumentsSnapshot = await handoversRef
      .doc(handoverId)
      .collection("handoverDocuments")
      .get();
    const handoverDocuments = handoverDocumentsSnapshot.docs.map((doc) =>
      parseFirestoreHandoverDocumentIntoHandoverDocument({
        docId: doc.id,
        data: doc.data() as FirebaseFirestore.DocumentData,
      }),
    );

    return handoverDocuments;
  },
  ["handoverDocuments"],
  {
    revalidate: false,
    tags: ["handoverDocuments"],
  },
);
