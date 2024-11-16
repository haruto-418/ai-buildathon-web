"use client";

import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Button } from "./ui/button";

const propsSchema = z.object({
  handoverId: z.string(),
  locale: localeSchema,
  clasName: z.string().optional(),
});
type Props = z.infer<typeof propsSchema>;
export function GenerateHandoverTableButton(props: Props) {
  const { handoverId, clasName, locale } = propsSchema.parse(props);

  async function onClickButton() {
    console.log("Generate handover table, handoverId:", handoverId);
  }

  return (
    <Button className={cn("", clasName)} onClick={onClickButton}>
      {locales[locale].generateHandoverTable}
    </Button>
  );
}
