import { unstable_cache } from "next/cache";
import { z } from "zod";

import type { Handover, HandoverDocument } from "@/lib/types";

import { firestoreTimestampToDate } from "../firestore-timestamp-to-date";
import { handoversRef } from "./server-utils";

function parseFirestoreHandoverIntoHandover({
  docId,
  data,
  handoverDocuments,
}: {
  docId: string;
  data: FirebaseFirestore.DocumentData;
  handoverDocuments: FirebaseFirestore.DocumentData[]; // サブコレクションのデータ
}): Handover {
  return {
    id: docId,
    ...(data as Omit<Handover, "id" | "handoverDocuments">),
    createdAt: firestoreTimestampToDate(data.createdAt),
    handoverDocuments: (handoverDocuments || []).map((doc) => ({
      id: doc.id,
      ...(doc as Omit<HandoverDocument, "id">),
      createdAt: firestoreTimestampToDate(doc.createdAt),
    })),
  };
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
    const handoverDocumentsSnapshot = await handoverDocRef
      .collection("handoverDocuments")
      .get();
    const handoverDocuments = handoverDocumentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
