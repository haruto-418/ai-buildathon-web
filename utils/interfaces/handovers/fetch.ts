import { unstable_cache } from "next/cache";
import { z } from "zod";

import type { Handover, HandoverDocument } from "@/lib/types";

import { handoverDocumentSchema, handoverSchema } from "@/lib/schemas";
import { firestoreTimestampToDate } from "../firestore-timestamp-to-date";
import { fetchHandoverDocumentsByHandoverId } from "../handover-documents/fetch";
import { handoversRef } from "./server-utils";

function parseFirestoreHandoverIntoHandover({
  docId,
  data,
  handoverDocuments: _handoverDocuments,
}: {
  docId: string;
  data: FirebaseFirestore.DocumentData;
  handoverDocuments: HandoverDocument[];
}): Handover {
  const handoverDocuments: HandoverDocument[] = _handoverDocuments.map(
    (doc) => {
      const handoverDocument: HandoverDocument = {
        id: doc.id,
        ...(doc as Omit<HandoverDocument, "id">),
      };

      return handoverDocumentSchema.parse(handoverDocument);
    },
  );

  const handover: Handover = {
    id: docId,
    ...(data as Omit<Handover, "id" | "handoverDocuments">),
    createdAt: firestoreTimestampToDate(data.createdAt),
    handoverDocuments,
  };

  return handoverSchema.parse(handover);
}

// ----------------- fetch handover -----------------
const fetchHandoverSchema = z.object({
  handoverId: z.string(),
});
type FetchHandover = z.infer<typeof fetchHandoverSchema>;

export const fetchHandover = unstable_cache(
  async (args: FetchHandover): Promise<Handover> => {
    const { handoverId } = fetchHandoverSchema.parse(args);

    const handoverDocRef = handoversRef.doc(handoverId);

    // メインのドキュメントを取得
    const handoverDoc = await handoverDocRef.get();
    if (!handoverDoc.exists) {
      throw new Error("Handover not found");
    }

    // サブコレクションを取得
    const handoverDocuments = await fetchHandoverDocumentsByHandoverId({
      handoverId,
    });

    return parseFirestoreHandoverIntoHandover({
      docId: handoverDoc.id,
      data: handoverDoc.data() as FirebaseFirestore.DocumentData,
      handoverDocuments,
    });
  },
  ["handovers"],
  {
    revalidate: false,
    tags: ["handovers"],
  },
);

// ----------------- fetch handovers by predecessor id -----------------
const fetchHandoversByPredecessorIdSchema = z.object({
  predecessorId: z.string(),
});
type FetchHandoversByPredecessorId = z.infer<
  typeof fetchHandoversByPredecessorIdSchema
>;
export const fetchHandoversByPredecessorId = unstable_cache(
  async (args: FetchHandoversByPredecessorId): Promise<Handover[]> => {
    const { predecessorId } = fetchHandoversByPredecessorIdSchema.parse(args);

    const handoversSnapshot = await handoversRef
      .where("predecessorId", "==", predecessorId)
      .get();

    const handovers = await Promise.all(
      handoversSnapshot.docs.map(async (doc) => {
        const handover = doc.data() as FirebaseFirestore.DocumentData;
        const handoverDocuments = await fetchHandoverDocumentsByHandoverId({
          handoverId: doc.id,
        });
        return parseFirestoreHandoverIntoHandover({
          docId: doc.id,
          data: handover,
          handoverDocuments,
        });
      }),
    );

    return handovers;
  },
  ["handovers"],
  {
    revalidate: false,
    tags: ["handovers"],
  },
);

// ----------------- fetch handovers by successor id -----------------
const fetchHandoversBySuccessorIdSchema = z.object({
  successorId: z.string(),
});
type FetchHandoversBySuccessorId = z.infer<
  typeof fetchHandoversBySuccessorIdSchema
>;
export const fetchHandoversBySuccessorId = unstable_cache(
  async (args: FetchHandoversBySuccessorId): Promise<Handover[]> => {
    const { successorId } = fetchHandoversBySuccessorIdSchema.parse(args);

    const handoversSnapshot = await handoversRef
      .where("successorId", "==", successorId)
      .get();
    const handovers = handoversSnapshot.docs.map((doc) => {
      const handover = doc.data() as FirebaseFirestore.DocumentData;
      return parseFirestoreHandoverIntoHandover({
        docId: doc.id,
        data: handover,
        handoverDocuments: [],
      });
    });

    return handovers;
  },
  ["handovers"],
  {
    revalidate: false,
    tags: ["handovers"],
  },
);
