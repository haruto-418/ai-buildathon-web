import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ClientLoader } from "@/components/client-loader";
import { locales } from "@/lib/locales";
import { handoverSchema, localeSchema } from "@/lib/schemas";
import type { Handover } from "@/lib/types";
import { createHandover } from "@/utils/interfaces/handovers/create";

const fetchDataSchema = z.object({
  locale: localeSchema,
  userId: z.string().nullable(),
});
type FetchData = z.infer<typeof fetchDataSchema>;
async function fetchData(args: FetchData) {
  const { userId, locale } = fetchDataSchema.parse(args);
  if (!userId) {
    throw new Error("User not found");
  }

  const _creatingHandover: Partial<Handover> = {
    id: "",
    title: locales[locale].unset,
    predecessorId: userId,
    handoverDocuments: [],
    createdAt: new Date(),
  };
  const creatingHandover = handoverSchema.parse(_creatingHandover);

  const handoverId = await createHandover({
    handover: creatingHandover,
    revalidate: false,
  });

  redirect(`/${locale}/handovers/${handoverId}`);
}

type Props = {
  params: Promise<{ locale: string }>;
};
export default async function Page({ params }: Props) {
  const { locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  const { userId } = await auth();

  await fetchData({ userId, locale });

  return <ClientLoader />;
}
