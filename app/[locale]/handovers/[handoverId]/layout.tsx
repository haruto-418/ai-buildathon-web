import { z } from "zod";

import { HandoverEditForm } from "@/components/handover-etid-form";
import { HandoverTopButton } from "@/components/handover-top-button";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import type { Locale } from "@/lib/types";
import { fetchHandover } from "@/utils/interfaces/handovers/fetch";
import { fetchOutputByHandoverId } from "@/utils/interfaces/outputs/fetch";

const fetchDataSchema = z.object({
  handoverId: z.string(),
});
type FetchData = z.infer<typeof fetchDataSchema>;
async function fetchData(args: FetchData) {
  const { handoverId } = fetchDataSchema.parse(args);

  const handover = await fetchHandover({ handoverId });
  const output = await fetchOutputByHandoverId({ handoverId });

  return { handover, output };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ handoverId: string; locale: Locale }>;
};
export default async function HandoverLayout({ children, params }: Props) {
  const { handoverId, locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  const { handover } = await fetchData({ handoverId });

  return (
    <div className="flex flex-col gap-10 md:gap-8">
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{`${locales[locale].titleOfHandover}: ${handover.title}`}</h1>
          <HandoverTopButton locale={locale} handoverId={handoverId} />
        </div>
        <HandoverEditForm
          handover={handover}
          locale={locale}
          className="w-4/6 md:w-fit"
        />
      </div>
      {children}
    </div>
  );
}
