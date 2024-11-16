import { HandoversTable } from "@/components/handovers-table";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import {
  fetchHandoversByPredecessorId,
  fetchHandoversBySuccessorId,
} from "@/utils/interfaces/handovers/fetch";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const fetchDataSchema = z.object({
  userId: z.string().nullable(),
});
type FetchData = z.infer<typeof fetchDataSchema>;
async function fetchData(args: FetchData) {
  const { userId } = fetchDataSchema.parse(args);
  if (!userId) {
    throw new Error("User not found");
  }

  const successorHandovers = await fetchHandoversBySuccessorId({
    successorId: userId,
  });
  const predecessorHandovers = await fetchHandoversByPredecessorId({
    predecessorId: userId,
  });

  return {
    successorHandovers,
    predecessorHandovers,
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  const { userId } = await auth();

  const { successorHandovers, predecessorHandovers } = await fetchData({
    userId,
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold">{locales[locale].mypage}</h1>
      <div>
        <h2 className="text-lg font-bold">
          {locales[locale].predecessorHandovers}
        </h2>
        <HandoversTable handovers={predecessorHandovers} locale={locale} />
      </div>
      <div>
        <h2 className="text-lg font-bold">
          {locales[locale].successorHandoevrs}
        </h2>
        <HandoversTable handovers={successorHandovers} locale={locale} />
      </div>
    </div>
  );
}
