import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { handoverSchema } from "@/lib/schemas";
import type { Handover } from "@/lib/types";
import { createHandover } from "@/utils/interfaces/handovers/create";
import { fetchHandover } from "@/utils/interfaces/handovers/fetch";

const fetchDataSchema = z.object({
  handoverId: z.string(),
  userId: z.string().nullable(),
});
type FetchData = z.infer<typeof fetchDataSchema>;
async function fetchData(args: FetchData) {
  const { handoverId, userId } = fetchDataSchema.parse(args);
  if (!userId) {
    throw new Error("User not found");
  }

  let handover: Handover | null = await fetchHandover({ handoverId });
  if (handover === null) {
    // 作る
    const _creatingHandover: Partial<Handover> = {
      id: handoverId,
      predecessorId: userId,
      handoverDocuments: [],
      createdAt: new Date(),
    };
    const creatingHandover = handoverSchema.parse(_creatingHandover);

    const _handoverId = await createHandover({
      handover: creatingHandover,
      revalidate: false,
    });

    // 再取得
    handover = await fetchHandover({ handoverId: _handoverId });
  }

  return { handover };
}

type Props = {
  params: Promise<{ handoverId: string; locale: string }>;
};

export default async function Page({ params }: Props) {
  const { handoverId, locale } = await params;

  const { userId } = await auth();

  const {} = await fetchData({ handoverId, userId });

  return (
    <div>
      <h1></h1>
      <div></div>
      <p>{handoverId}</p>
      <p>{locale}</p>
    </div>
  );
}
