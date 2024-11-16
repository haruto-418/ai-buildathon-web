import { outputSchema } from "@/lib/schemas";
import { Output } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { firestoreTimestampToDate } from "../firestore-timestamp-to-date";
import { outputsRef } from "./server-utils";

function parseFirestoreOutputIntoOutput({
  docId,
  data,
}: {
  docId: string;
  data: FirebaseFirestore.DocumentData;
}): Output {
  const output: Output = {
    id: docId,
    ...(data as Omit<Output, "id">),
    createdAt: firestoreTimestampToDate(data.createdAt),
  };

  return outputSchema.parse(output);
}

// ----------------- fetch output -----------------
const fetchOutputSchema = z.object({
  outputId: z.string(),
});
type FetchOutput = z.infer<typeof fetchOutputSchema>;
export const fetchOutput = unstable_cache(
  async (args: FetchOutput): Promise<Output> => {
    const { outputId } = fetchOutputSchema.parse(args);

    const outputDoc = await outputsRef.doc(outputId).get();
    if (!outputDoc.exists) {
      throw new Error(`Output not found: ${outputId}`);
    }

    return parseFirestoreOutputIntoOutput({
      docId: outputDoc.id,
      data: outputDoc.data() as FirebaseFirestore.DocumentData,
    });
  },
  ["outputs"],
  {
    revalidate: false,
    tags: ["outputs"],
  },
);

// ----------------- fetch output by handoverId -----------------
const fetchOutputByHandoverIdSchema = z.object({
  handoverId: z.string(),
});
type FetchOutputByHandoverId = z.infer<typeof fetchOutputByHandoverIdSchema>;
export const fetchOutputByHandoverId = unstable_cache(
  async (args: FetchOutputByHandoverId): Promise<Output[]> => {
    const { handoverId } = fetchOutputByHandoverIdSchema.parse(args);

    const outputDocs = await outputsRef
      .where("handoverId", "==", handoverId)
      .get();
    const outputs = outputDocs.docs.map((doc) =>
      parseFirestoreOutputIntoOutput({
        docId: doc.id,
        data: doc.data() as FirebaseFirestore.DocumentData,
      }),
    );

    return outputs;
  },
  ["outputs"],
  {
    revalidate: false,
    tags: ["outputs"],
  },
);
