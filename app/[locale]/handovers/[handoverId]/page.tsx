import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import type { Handover } from "@/lib/types";
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

  const handover: Handover | null = await fetchHandover({ handoverId });

  return { handover };
}

type Props = {
  params: Promise<{ handoverId: string; locale: string }>;
};

export default async function Page({ params }: Props) {
  const { handoverId, locale } = await params;

  const { userId } = await auth();

  const { handover } = await fetchData({ handoverId, userId });

  console.log(handover);

  return (
    <div>
      <h1></h1>
      <div></div>
      <p>{handover?.id}</p>
      <p>{locale}</p>
    </div>
  );
}
