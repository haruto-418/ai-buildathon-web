import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { z } from "zod";

import { ConnectSlackButton } from "@/components/connect-slack-button";
import { FilesTable } from "@/components/files-table";
import { GenerateHandoverTableButton } from "@/components/generate-handover-table-button";
import { HandoverDocumentForm } from "@/components/handover-document-form";
import { SuccessorForm } from "@/components/successor-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import type { Handover, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { fetchHandover } from "@/utils/interfaces/handovers/fetch";
import { fetchOutputByHandoverId } from "@/utils/interfaces/outputs/fetch";
import { fetchUser } from "@/utils/interfaces/users/fetch";

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

  const handover: Handover = await fetchHandover({ handoverId });
  const output = await fetchOutputByHandoverId({ handoverId });
  const user = await fetchUser({ userId });

  const { successorId } = handover;

  const successor = successorId
    ? await fetchUser({ userId: successorId })
    : null;

  return { handover, user, successor, output };
}

type Props = {
  params: Promise<{ handoverId: string; locale: Locale }>;
};

export default async function Page({ params }: Props) {
  const { handoverId, locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  const { userId } = await auth();

  const { handover, user, successor, output } = await fetchData({
    handoverId,
    userId,
  });

  return (
    <div className="flex flex-col gap-10 md:gap-8">
      <Card>
        <CardContent className="p-4">
          <p>{`${locales[locale].predecessor}: ${user.firstName} ${user.lastName}`}</p>
          <p>{`${locales[locale].successor}: ${
            successor ? `${successor.firstName} ${successor.lastName}` : ""
          }`}</p>
        </CardContent>
      </Card>
      <SuccessorForm handover={handover} locale={locale} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center md:gap-0">
          <h2 className="text-md font-bold">
            {locales[locale].handoverDocumentList}
          </h2>
          <div className="flex items-center gap-2">
            <HandoverDocumentForm locale={locale} handoverId={handoverId} />
            <ConnectSlackButton />
          </div>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="py-0">
              {locales[locale].display}
            </AccordionTrigger>
            <AccordionContent>
              <FilesTable
                fileData={handover.handoverDocuments.map((doc) => ({
                  fileTitle: doc.title,
                  fileUrl: doc.url,
                }))}
                locale={locale}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <h2 className="text-md font-bold">{locales[locale].handoverTable}</h2>
        {output?.handoverTableString ? (
          <div className="flex justify-center">
            <Link
              href={`/${locale}/handovers/${handoverId}/phase-1`}
              className={cn(buttonVariants({}), "rounded-full")}
            >
              {locales[locale].handoverTable}
            </Link>
          </div>
        ) : (
          <div className="flex justify-center bg-gray-50 py-8">
            <GenerateHandoverTableButton
              handoverId={handoverId}
              locale={locale}
              clasName="font-bold bg-teal-500 text-white rounded-full text-lg px-8 py-6"
            />
          </div>
        )}
      </div>
    </div>
  );
}
