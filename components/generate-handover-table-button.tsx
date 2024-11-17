"use client";

import { redirect } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { sampleDoc } from "@/lib/data";
import { locales } from "@/lib/locales";
import { localeSchema, outputSchema } from "@/lib/schemas";
import { Output } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createOutput } from "@/utils/interfaces/outputs/create";
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
          customersJson: `
            会社名	業種	所在地	電話番号	メールアドレス	担当者名	役職	取引状況	興味関心	課題・ニーズ	過去の接触履歴	次回アクション	契約開始日	契約終了日	年間取引額	競合情報	優先度	メモ	グリーンテック株式会社	製造業	東京都港区	03-1234-5678	greentech@example.com	田中 太郎	課長	契約中	清掃効率化、耐久性	現場での清掃時間短縮	展示会でのデモを通じ契約	新製品の提案とデモを実施	2023-06-01	2025-05-31	1,200万円	競合製品に劣らない性能	高	リピート率が高い顧客						
          `,
          document: sampleDoc,
        }),
      },
    );
    if (!res.ok) {
      console.error("Failed to generate handover table", res.statusText);
      return;
    }

    const { data } = await res.json();
    const _output: Partial<Output> = {
      id: "",
      handoverId,
      handoverTableString: data,
      createdAt: new Date(),
    };
    const output = outputSchema.parse(_output);
    try {
      await createOutput({
        output,
      });
    } catch (err) {
      console.error(`Failed to create output: ${err}`);
      throw new Error(`Failed to create output: ${err}`);
    }

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
