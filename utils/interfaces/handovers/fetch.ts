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
  async (args: FetchHandover): Promise<Handover | null> => {
    const { handoverId } = fetchHandoverSchema.parse(args);

    const handoverDocRef = handoversRef.doc(handoverId);

    // メインのドキュメントを取得
    const handoverDoc = await handoverDocRef.get();
    if (!handoverDoc.exists) {
      return null;
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
