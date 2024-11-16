import { handoverDocumentSchema } from "@/lib/schemas";
import { HandoverDocument } from "@/lib/types";
import { z } from "zod";
import { firestoreTimestampToDate } from "../firestore-timestamp-to-date";

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
