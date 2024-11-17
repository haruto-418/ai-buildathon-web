"use client";

import { redirect } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useState } from "react";

const propsSchema = z.object({
  handoverId: z.string(),
  locale: localeSchema,
  clasName: z.string().optional(),
});
type Props = z.infer<typeof propsSchema>;
export function GenerateHandoverTableButton(props: Props) {
  const { handoverId, clasName, locale } = propsSchema.parse(props);

  const [submitting, setSubmitting] = useState<boolean>(false);

  async function onClickButton() {
    setSubmitting(true);

    console.log("Generate handover table, handoverId:", handoverId);
    const res = await fetch(
      `/api/handovers/${handoverId}/generate-handover-table`,
      {
        method: "POST",
        body: JSON.stringify({
          customersJson: "",
          document: "",
        }),
      },
    );
    if (!res.ok) {
      console.error("Failed to generate handover table", res.statusText);
      return;
    }

    const data = await res.json();
    console.log({ data });

    console.log("Handover table generated successfully");

    setSubmitting(false);
    redirect(`/${locale}/handovers/${handoverId}/phase-1`);
  }

  return (
    <Button
      className={cn("", clasName)}
      onClick={onClickButton}
      disabled={submitting}
    >
      {locales[locale].generateHandoverTable}
    </Button>
  );
}
